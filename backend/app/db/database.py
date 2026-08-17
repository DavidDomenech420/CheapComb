from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

URL_CONEXION_BBDD = "postgresql://david_dom:Varc2369!@127.0.0.1:5432/registro_gasolineras_db"
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