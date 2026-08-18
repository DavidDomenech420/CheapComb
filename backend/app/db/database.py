import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

# Cargamos en memoria la informacion del .env
load_dotenv()

url_base_datos = os.getenv("URL_BASE_DATOS")

URL_CONEXION_BBDD = url_base_datos
motor = create_engine(URL_CONEXION_BBDD, echo=False)

class Base(DeclarativeBase):
    pass

def inicializar_bd():
    # Importante: para que SQLAlchemy sepa qué tablas crear, 
    # los modelos deben estar importados antes de llamar a create_all()
    from app.db.modelos.gasolinera import Gasolinera
    from app.db.modelos.dispositivo import Dispositivo
    from app.db.modelos.favorito import Favorito
    from app.db.modelos.alerta import Alerta
    Base.metadata.create_all(motor)