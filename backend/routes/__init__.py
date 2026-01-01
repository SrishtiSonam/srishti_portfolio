from .auth import router as auth_router
from .public import router as public_router
from .admin import router as admin_router
from .ai import router as ai_router

__all__ = ["auth_router", "public_router", "admin_router", "ai_router"]
