#pragma once

#include "Math\Point2D.h"

namespace Engine
{
	class GameObject
	{
		virtual void Move(Engine::Math::Point2D *location) = 0;
		virtual int xGetPosition(Engine::Math::Point2D *object) = 0;
		virtual int yGetPosition(Engine::Math::Point2D *object) = 0;
	};
}