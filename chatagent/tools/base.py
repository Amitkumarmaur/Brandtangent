"""Base tool class and registry for Gemini function calling."""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class BaseTool(ABC):
    name: str
    description: str
    parameters: Dict[str, Any]

    @abstractmethod
    def execute(self, **kwargs: Any) -> Dict[str, Any]:
        ...


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: Dict[str, BaseTool] = {}

    def register(self, tool: BaseTool) -> None:
        self._tools[tool.name] = tool
        logger.debug("Registered tool: %s", tool.name)

    def get(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def execute(self, name: str, **kwargs: Any) -> Dict[str, Any]:
        tool = self.get(name)
        if tool is None:
            return {"error": f"Unknown tool: {name}"}
        logger.info("Tool %s args=%s", name, kwargs)
        try:
            return tool.execute(**kwargs)
        except Exception as exc:
            logger.exception("Tool %s failed", name)
            return {"error": str(exc)}

    def all_tools(self) -> List[BaseTool]:
        return list(self._tools.values())
