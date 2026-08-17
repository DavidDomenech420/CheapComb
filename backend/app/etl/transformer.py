def maquetar_json(lista_gasolineras):    
    lista_maquetada = []
    for gasolinera in lista_gasolineras:
        lista_maquetada.append(limpiar_gasolinera(gasolinera))
    return lista_maquetada


def limpiar_float(texto_numerico: str, decimales: int | None = None) -> float | None:
    if not texto_numerico or not str(texto_numerico).strip():
        return None
    try:
        limpio = str(texto_numerico).replace(",", ".").strip()
        valor = float(limpio)
        return round(valor, decimales) if decimales is not None else valor
    except (ValueError, TypeError):
        return None

def limpiar_precio(texto_numerico: str) -> float | None:
    return limpiar_float(texto_numerico, 3)

def limpiar_texto(texto_arg: str | None) -> str | None:
    if not texto_arg or not isinstance(texto_arg, str):
        return None
    return texto_arg.strip().title()

def limpiar_gasolinera(gasolinera_cruda: dict) -> dict:
    latitud = limpiar_float(gasolinera_cruda.get("Latitud"))
    longitud = limpiar_float(gasolinera_cruda.get("Longitud (WGS84)"))
    if latitud and longitud:
        ubicacion_geometrica = f"POINT({longitud} {latitud})"
    else:
        ubicacion_geometrica = None
    return{
        "id": gasolinera_cruda.get("IDEESS"),
        "nombre": limpiar_texto(gasolinera_cruda.get("Rótulo")),
        "municipio": limpiar_texto(gasolinera_cruda.get("Municipio")),
        "direccion": limpiar_texto(gasolinera_cruda.get("Dirección")),
        "latitud": latitud,
        "longitud": longitud,
        "ubicacion_geometrica": ubicacion_geometrica,
        "horario": gasolinera_cruda.get("Horario"),
        "precio_gasolina_95_e5": limpiar_precio(gasolinera_cruda.get("Precio Gasolina 95 E5")),
        "precio_gasolina_95_e10": limpiar_precio(gasolinera_cruda.get("Precio Gasolina 95 E10")),
        "precio_gasoleo_a": limpiar_precio(gasolinera_cruda.get("Precio Gasoleo A")),
        "precio_gasolina_98_e5": limpiar_precio(gasolinera_cruda.get("Precio Gasolina 98 E5")),
        "precio_gasoleo_premium": limpiar_precio(gasolinera_cruda.get("Precio Gasoleo Premium")),
        "precio_gases_licuados_petroleo": limpiar_precio(gasolinera_cruda.get("Precio Gases licuados del petróleo"))
    }