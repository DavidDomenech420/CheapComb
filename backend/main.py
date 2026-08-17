import time
import schedule

from app.etl.extractor import obtener_datos_gobierno
from app.etl.transformer import maquetar_json
from app.db.database import inicializar_bd
from app.etl.loader import cargar_gasolineras

def actualizar_datos_gasolineras():
    try:
        json = obtener_datos_gobierno()

        lista_gasolineras_raw = json.get("ListaEESSPrecio", [])

        lista_gasolineras_limpia = maquetar_json(lista_gasolineras_raw)

        cargar_gasolineras(lista_gasolineras_limpia)
    except Exception as error:
        print(f"Error en la descarga de gasolineras: {error}")

if __name__ == "__main__":
    inicializar_bd()

    actualizar_datos_gasolineras()

    schedule.every().hour.do(actualizar_datos_gasolineras)

    while True:
        schedule.run_pending() # Miramos si es la hora de actualizar la base de datos, si no esperamos 1 minuto
        time.sleep(60)


