from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey
from app.db.database import Base
from pydantic import BaseModel

class GasolineraGuardadaInput (BaseModel):
    id_usuario: str
    id_gasolinera: str

class Favorito(Base):
    __tablename__ = "favoritos"

    id_dispositivo: Mapped[str] = mapped_column(ForeignKey("dispositivos.id"), primary_key=True)
    id_gasolinera: Mapped[str] = mapped_column(ForeignKey("gasolineras.id"), primary_key=True)
