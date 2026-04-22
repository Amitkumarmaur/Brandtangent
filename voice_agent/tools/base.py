"""
tools/base.py — Base class and registry for all agent tools.

Every tool maps directly to a Gemini function-calling declaration so the
Live API knows when and how to invoke it.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class BaseTool(ABC):
    """
    Abstract base for all voice agent tools.

    Subclasses must define:
      - name        : unique snake_case identifier
      - description : one-sentence description for the LLM
      - parameters  : JSON Schema object describing the function parameters
      - execute()   : the actual implementation
    """

    #: Unique tool name (snake_case)
    name: str
    #: Human-readable description used in the system prompt and Gemini declaration
    description: str
    #: JSON Schema for the tool's parameters
    parameters: Dict[str, Any]

    @abstractmethod
    def execute(self, **kwargs) -> Dict[str, Any]:
        """
        Run the tool with the given keyword arguments.

        Returns:
            A dict that will be serialized and sent back to the model as the
            function result. Must include at least a ``"result"`` key.
        """
        ...

    def to_gemini_declaration(self) -> Dict[str, Any]:
        """
        Convert this tool to Gemini function-calling declaration format.
        """
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters,
        }


class ToolRegistry:
    """
    Central registry that holds all available tools and dispatches calls.
    """

    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}

    def register(self, tool: BaseTool) -> None:
        """Add a tool to the registry."""
        self._tools[tool.name] = tool
        logger.debug("Registered tool: %s", tool.name)

    def get(self, name: str) -> Optional[BaseTool]:
        """Retrieve a tool by name, or None if not found."""
        return self._tools.get(name)

    def execute(self, name: str, **kwargs) -> Dict[str, Any]:
        """
        Look up and execute a tool by name.

        Args:
            name:   Tool name as returned by Gemini function calling.
            kwargs: Arguments extracted from the Gemini function call.

        Returns:
            Tool result dict.
        """
        tool = self.get(name)
        if tool is None:
            logger.warning("Unknown tool called: %s", name)
            return {"error": f"Tool '{name}' not found."}

        logger.info("▶ Executing tool: %s | args: %s", name, kwargs)
        try:
            result = tool.execute(**kwargs)
            logger.info("✓ Tool %s returned: %s", name, result)
            return result
        except Exception as exc:
            logger.error("Tool %s raised an error: %s", name, exc)
            return {"error": str(exc)}

    def gemini_tools_config(self) -> List[Dict[str, Any]]:
        """
        Return the full tools configuration for the Gemini Live API session.
        Format: [{"function_declarations": [...]}]
        """
        declarations = [t.to_gemini_declaration() for t in self._tools.values()]
        return [{"function_declarations": declarations}] if declarations else []

    def list_tools(self) -> List[str]:
        return list(self._tools.keys())
