from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, defer
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, cast
from geoalchemy2 import WKTElement, Geography
from geoalchemy2.functions import ST_DWithin

from app.db.database import motor
from app.db.modelos.gasolinera import Gasolinera
from app.db.modelos.favorito import Favorito, GasolineraGuardadaInput
from app.db.modelos.dispositivo import Dispositivo
from app.db.modelos.alerta import Alerta, AlertaPrecioInput

# Inicializamos la app de FastAPI
app = FastAPI(title="API Gasolineras")

# Funcion generadora de sesiones
def obtener_sesion_bd():
    with Session(motor) as sesion:
        yield sesion # El yield pausa la funcion, le entrega la sesion a FastAPI y cuando FastAPI termina, la funcion cierra la sesion

# Definimos endpoint con el metodo GET
@app.get("/gasolineras/")
def obtener_gasolineras_radio_10_km(bd: Session = Depends(obtener_sesion_bd), radio_km: int = 10, longitud_usuario: float = 0, latitud_usuario: float = 0):
    # Construimos la consulta con un limite de que salgan solo las primeras 10 gasolineras
    punto_usuario = f"POINT({longitud_usuario} {latitud_usuario})"
    punto_postgis = WKTElement(punto_usuario, srid=4326)

    consulta = select(Gasolinera).options(defer(Gasolinera.ubicacion_geometrica)).where(
        ST_DWithin(
            cast(Gasolinera.ubicacion_geometrica, Geography),
            cast(punto_postgis, Geography),
            radio_km * 1000
        )
    ).order_by(Gasolinera.precio_gasoleo_a.asc()).limit(10)

    # Ejecutamos la consulta, la limpiamos y los metemos a una lista
    lista_gasolinera = bd.execute(consulta).scalars().all()

    if not lista_gasolinera:
        return []

    return lista_gasolinera

@app.get("/favoritos/{id_usuario}")
def obtener_gasolineras_favoritas(id_usuario: str, bd: Session = Depends(obtener_sesion_bd)):

    consulta = select(Gasolinera).join(Favorito, Gasolinera.id == Favorito.id_gasolinera).options(defer(Gasolinera.ubicacion_geometrica)).where(Favorito.id_dispositivo == id_usuario)

    lista_gasolinera = bd.execute(consulta).scalars().all()

    if not lista_gasolinera:
        return []

    return lista_gasolinera


@app.post("/gasolineras_favoritas/", status_code=201)
def guardar_gasolinera_favorita(datos_entrada: GasolineraGuardadaInput, bd: Session = Depends(obtener_sesion_bd)):
    # Comprobamos que la gasolinera que queremos guardar existe
    gasolinera_existe = bd.execute(select(Gasolinera).where(Gasolinera.id == datos_entrada.id_gasolinera)).scalar_one_or_none()

    if not gasolinera_existe:
        raise HTTPException(status_code=404, detail="La gasolinera no existe")
    
    # Miramos si existe el usuario (Ha guardado algo anteriormente), si no existe lo creamos automaticamente

    dispositivo = bd.execute(select(Dispositivo).where(Dispositivo.id == datos_entrada.id_usuario)).scalar_one_or_none()
    
    if not dispositivo:
        nuevo_dispositivo = Dispositivo(id=datos_entrada.id_usuario)
        bd.add(nuevo_dispositivo)
        bd.commit()
    
    # Creamos el favorito
    nuevo_favorito = Favorito(
        id_gasolinera=datos_entrada.id_gasolinera,
        id_dispositivo=datos_entrada.id_usuario
    )

    # Guardamos el favorito en la base de datos
    try:
        bd.add(nuevo_favorito)
        bd.commit()
        return {"mensaje": "Gasolinera guardada correctamente"}
    except IntegrityError:
        # Por si le damos sin querer dos veces y la gasolinera ya estaba guardada, tiramos hacia atras deshaciendo el error
        bd.rollback()
        return {"mensaje": "La Gasolinera ya estaba en tu lista"}

@app.post(f"/alerta/gasolinera/", status_code=201)
def crear_alerta_gasolinera(datos_entrada: AlertaPrecioInput, bd: Session = Depends(obtener_sesion_bd)):
    gasolinera = bd.execute(select(Gasolinera).where(Gasolinera.id == datos_entrada.id_gasolinera)).scalar_one_or_none()

    if not gasolinera:
        raise HTTPException(status_code=404, detail="La gasolinera no existe")
    
    dispositivo = bd.execute(select(Dispositivo).where(Dispositivo.id == datos_entrada.id_dispositivo)).scalar_one_or_none()

    if not dispositivo:
        bd.add(Dispositivo(id=datos_entrada.id_dispositivo))
        bd.commit()
    
    alerta = bd.execute(select(Alerta).where(Alerta.id_dispositivo == datos_entrada.id_dispositivo, Alerta.id_gasolinera == datos_entrada.id_gasolinera, Alerta.tipo_combustible == datos_entrada.tipo_combustible)).scalar_one_or_none()

    if not alerta:
        nueva_alerta = Alerta(
            id_dispositivo=datos_entrada.id_dispositivo,
            id_gasolinera=datos_entrada.id_gasolinera,
            tipo_combustible=datos_entrada.tipo_combustible,
            precio_objetivo=datos_entrada.precio_limite
        )
        bd.add(nueva_alerta)
        bd.commit()



    return {"mensaje": "Se ha creado la alerta correctamente"}

@app.get("/favoritos/alertas/{id_gasolinera}")
def obtener_alertas_usuario(id_telefono: str, id_gasolinera: str, bd: Session = Depends(obtener_sesion_bd)):
    consulta = select(Alerta, Gasolinera).join(Gasolinera, Alerta.id_gasolinera == Gasolinera.id).where(Alerta.id_dispositivo == id_telefono, Alerta.id_gasolinera == id_gasolinera)

    resultados = bd.execute(consulta).all()

    lista_limpia = []
    for alerta, gasolinera in resultados:
        lista_limpia.append({
            "id_alerta": alerta.id,
            "tipo_combustible": alerta.tipo_combustible,
            "precio_objetivo": alerta.precio_objetivo,
            "nombre_gasolinera": gasolinera.nombre,
            "direccion": gasolinera.direccion
        })
    
    return lista_limpia

@app.delete("/alerta_precio/{id_alerta}")
def borrar_alerta(id_alerta: int, id_dispositivo: str, bd: Session = Depends(obtener_sesion_bd)):
    alerta_borrar = bd.execute(select(Alerta).where(Alerta.id == id_alerta, Alerta.id_dispositivo == id_dispositivo)).scalar_one_or_none()

    if not alerta_borrar:
        raise HTTPException(status_code=404, detail="La alerta no existe o no es tuya")
    
    bd.delete(alerta_borrar)
    bd.commit()

    return {"mensaje": "Alerta eliminada correctamente"}