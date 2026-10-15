from sqlalchemy.orm import Session
from sqlalchemy import select
import httpx

from app.db.modelos.alerta import Alerta
from app.db.modelos.gasolinera import Gasolinera
from app.db.modelos.usuario import Usuario

def enviar_notif_push(token: str, titulo: str, mensaje: str):
    url = "https://exp.host/--/api/v2/push/send"
    cabeceras = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    cuerpo = {
        "to": token,
        "title": titulo,
        "body": mensaje
    }

    try:
        respuesta = httpx.post(url, headers=cabeceras, json=cuerpo)
        respuesta.raise_for_status()
        print(f"Notificacion enviada a {token}: {titulo}")
    except Exception as e:
        print(f"Error al enviar la notificación a {token}: {e}")

def revisar_alertas_gasolinera(bd: Session):
    lista_alertas = bd.execute(select(Alerta, Gasolinera).join(Gasolinera, Alerta.id_gasolinera == Gasolinera.id)).all()

    cache_usuarios = {}
    for alerta, gasolinera in lista_alertas:
        tipo_combustible_alerta = alerta.tipo_combustible
        precio_alerta = None
        if tipo_combustible_alerta == "Gasolina 95 E5":
            precio_alerta = gasolinera.precio_gasolina_95_e5
        elif tipo_combustible_alerta == "gasolina_95_e10":
            precio_alerta = gasolinera.precio_gasolina_95_e10
        elif tipo_combustible_alerta == "Gasoleo A":
            precio_alerta = gasolinera.precio_gasoleo_a
        elif tipo_combustible_alerta == "Gasolina 98":
            precio_alerta = gasolinera.precio_gasolina_98_e5
        elif tipo_combustible_alerta == "Gasoleo Premium":
            precio_alerta = gasolinera.precio_gasoleo_premium
        elif tipo_combustible_alerta == "Gases Licuados":
            precio_alerta = gasolinera.precio_gases_licuados_petroleo

        if alerta.id_usuario in cache_usuarios:
            usuario = cache_usuarios[alerta.id_usuario]
        else:
            usuario = bd.execute(select(Usuario).where(Usuario.id == alerta.id_usuario)).scalar_one_or_none()
            cache_usuarios[alerta.id_usuario] = usuario

        if not usuario or not usuario.dispositivos:
            continue

        if precio_alerta is not None:
            if precio_alerta <= alerta.precio_objetivo and alerta.oferta_activa == False:
                alerta.oferta_activa = True
                titulo = "Combustible en Oferton!"
                msg =f"La gasolinera ha bajado a {precio_alerta}€ el combustible {tipo_combustible_alerta}."
                for dispositivo in usuario.dispositivos:
                    enviar_notif_push(dispositivo.token, titulo, msg)

            elif precio_alerta > alerta.precio_objetivo + 0.02 and alerta.oferta_activa == True:
                alerta.oferta_activa = False
                titulo = "Subida de Precio!"
                msg =f"La gasolinera ha subido a {precio_alerta}€ el combustible {tipo_combustible_alerta}."
                for dispositivo in usuario.dispositivos:
                    enviar_notif_push(dispositivo.token, titulo, msg)
    
    bd.commit()
