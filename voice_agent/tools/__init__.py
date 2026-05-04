# voice_agent/tools/__init__.py
from tools.base import ToolRegistry
from tools.book_appointment_tool import BookAppointmentTool
from tools.content_lookup_tool import (
    FindCaseStudyTool,
    FindFaqTool,
    FindServiceTool,
)
from tools.end_call_tool import EndCallTool
from tools.lead_capture_tool import LeadCaptureTool

# Build the global tool registry.
registry = ToolRegistry()
registry.register(BookAppointmentTool())
registry.register(LeadCaptureTool())
registry.register(FindServiceTool())
registry.register(FindCaseStudyTool())
registry.register(FindFaqTool())
registry.register(EndCallTool())

__all__ = ["registry"]
