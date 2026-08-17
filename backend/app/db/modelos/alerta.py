from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, Float, Boolean
from app.db.database import Base
from pydantic import BaseModel

class AlertaPrecioInput(BaseModel):
    id_dispositivo: str
    id_gasolinera: str
    tipo_combustible: str
    precio_limite: float

class Alerta(Base):
    __tablename__ = "alertas"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_dispositivo: Mapped[str] = mapped_column(ForeignKey("dispositivos.id"))
    id_gasolinera: Mapped[str] = mapped_column(ForeignKey("gasolineras.id"))
    tipo_combustible: Mapped[str] = mapped_column(String)
    precio_objetivo: Mapped[float] = mapped_column(Float)
    oferta_activa: Mapped[bool] = mapped_column(Boolean, default=False)