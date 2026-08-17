import logging
import httpx
import ssl

URLAPI = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/"
contexto_ssl = ssl.create_default_context()
contexto_ssl.set_ciphers("DEFAULT@SECLEVEL=1")
cliente = httpx.Client(verify=contexto_ssl, timeout=15.0)
def obtener_datos_gobierno():
    try:
        respuesta = cliente.get(URLAPI)
        respuesta.raise_for_status()
        return respuesta.json()
    
    except httpx.HTTPStatusError as error:
        logging.error(f"Error de HTTP: {error.response.status_code}")
        logging.error(f"Detalles: {error}")
        raise error
    except httpx.RequestError as error:
        # Esto atrapa errores de red, como pérdida de conexión o timeouts
        logging.error(f"Error de red: {error}")
        raise error