# voice_agent/tools/__init__.py
from tools.base import ToolRegistry
from tools.calendar_tool import CalendarTool
from tools.lead_capture_tool import LeadCaptureTool

# Build the global tool registry
registry = ToolRegistry()
registry.register(CalendarTool())
registry.register(LeadCaptureTool())

__all__ = ["registry"]
