from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration settings loaded from environment variables or a .env file.
    """

    # Application information
    APP_NAME: str = "Employee Management API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # PostgreSQL connection information
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        """
        Construct and return the PostgreSQL database connection URL.

        Returns:
            str: The fully formatted database connection string.
        """
        return (
            "postgresql+psycopg2://"
            f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}"
            f"/{self.POSTGRES_DB}"
        )


@lru_cache
def get_settings() -> Settings:
    """
    Retrieve the application settings instance.
    The settings are cached using lru_cache to prevent reloading the configuration from disk/env multiple times.

    Returns:
        Settings: The cached application settings instance.
    """
    return Settings()


settings = get_settings()