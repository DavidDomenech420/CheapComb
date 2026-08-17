from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session
from ..db.modelos.gasolinera import Gasolinera
from ..db.database import motor

def cargar_gasolineras(lista_gasolineras_limpia: list[dict]):
    # Abrimos sesion con la base de datos (transaccion)
    with Session(motor) as sesion:
        orden_insertar = insert(Gasolinera).values(lista_gasolineras_limpia)

        # Si hay un conflicto en el insert (El ID ya existe), en vez de hacer un insert, actualizamos la gasolinera con el horario que pueda tener nuevo y los precios de los combustibles
        orden_upsert = orden_insertar.on_conflict_do_update(
            index_elements=['id'],
            set_={
                'horario': orden_insertar.excluded.horario,
                'precio_gasolina_95_e5': orden_insertar.excluded.precio_gasolina_95_e5,
                'precio_gasolina_95_e10': orden_insertar.excluded.precio_gasolina_95_e10,
                'precio_gasoleo_a': orden_insertar.excluded.precio_gasoleo_a,
                'precio_gasolina_98_e5': orden_insertar.excluded.precio_gasolina_98_e5,
                'precio_gasoleo_premium': orden_insertar.excluded.precio_gasoleo_premium,
                'precio_gases_licuados_petroleo': orden_insertar.excluded.precio_gases_licuados_petroleo
            }
        )

        # Ejecutamos el orden de upsert y guardamos los cambios (commit)
        sesion.execute(orden_upsert)
        sesion.commit()