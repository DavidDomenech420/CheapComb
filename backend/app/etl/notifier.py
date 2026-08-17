from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.modelos.alerta import Alerta
from app.db.modelos.gasolinera import Gasolinera


def revisar_alertas_gasolinera(bd: Session):
    lista_alertas = bd.execute(select(Alerta, Gasolinera).join(Gasolinera, Alerta.id_gasolinera == Gasolinera.id)).all()

    for alerta, gasolinera in lista_alertas:
        tipo_combustible_alerta = alerta.tipo_combustible
        precio_alerta = 0
        if tipo_combustible_alerta == "gasolina_95_e5":
            precio_alerta = gasolinera.precio_gasolina_95_e5
        elif tipo_combustible_alerta == "gasolina_95_e10":
            precio_alerta = gasolinera.precio_gasolina_95_e10
        elif tipo_combustible_alerta == "gasoleo_a":
            precio_alerta = gasolinera.precio_gasoleo_a
        elif tipo_combustible_alerta == "gasolina_98_e5":
            precio_alerta = gasolinera.precio_gasolina_98_e5
        elif tipo_combustible_alerta == "gasoleo_premium":
            precio_alerta = gasolinera.precio_gasoleo_premium
        elif tipo_combustible_alerta == "gases_licuados_petroleo":
            precio_alerta = gasolinera.precio_gases_licuados_petroleo
        
        if precio_alerta is not None:
            if precio_alerta <= alerta.precio_objetivo and alerta.oferta_activa == False:
                alerta.oferta_activa = True
            elif precio_alerta > alerta.precio_objetivo and alerta.oferta_activa == True:
                alerta.oferta_activa = False
    
    bd.commit()
