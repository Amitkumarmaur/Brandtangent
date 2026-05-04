from .base import ToolRegistry
from .calendar_tool import CalendarTool
from .dynamic_webhooks import register_dynamic_webhooks
from .lead_capture_tool import LeadCaptureTool
from .web_search_tool import WebSearchTool


def build_tool_registry() -> ToolRegistry:
    r = ToolRegistry()
    r.register(CalendarTool())
    r.register(LeadCaptureTool())
    r.register(WebSearchTool())
    register_dynamic_webhooks(r)
    return r


__all__ = ["build_tool_registry", "ToolRegistry"]
