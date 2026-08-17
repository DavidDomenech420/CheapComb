from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float
from geoalchemy2 import Geometry
from app.db.database import Base

class Gasolinera(Base):
    __tablename__ = "gasolineras" # Nombre de la tabla en la base de datos

    id: Mapped[str] = mapped_column(String, primary_key=True)
    nombre: Mapped[str] = mapped_column(String)
    municipio: Mapped[str] = mapped_column(String)
    direccion: Mapped[str] = mapped_column(String)
    latitud: Mapped[float] = mapped_column(Float)
    longitud: Mapped[float] = mapped_column(Float)
    ubicacion_geometrica = mapped_column(Geometry(geometry_type="POINT", srid=4326))
    horario: Mapped[str] = mapped_column(String)
    precio_gasolina_95_e5: Mapped[float] = mapped_column(Float, nullable=True)
    precio_gasolina_95_e10: Mapped[float] = mapped_column(Float, nullable=True)
    precio_gasoleo_a: Mapped[float] = mapped_column(Float, nullable=True)
    precio_gasolina_98_e5: Mapped[float] = mapped_column(Float, nullable=True)
    precio_gasoleo_premium: Mapped[float] = mapped_column(Float, nullable=True)
    precio_gases_licuados_petroleo: Mapped[float] = mapped_column(Float, nullable=True)