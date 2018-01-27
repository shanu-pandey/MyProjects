#pragma once
#include "Monster.h"

namespace Engine
{
	namespace Actor
	{
		inline char *Monster::GetName()
		{
			return this->pName;
		}

		inline void Monster::Move(Engine::Math::Point2D i_location)
		{
			this->location = i_location;
		}

		inline int Monster::getXLocation()
		{
			return this->location.getX();
		}

		inline int Monster::getYLocation()
		{
			return this->location.getY();
		}

		inline void Monster::setXLocation(int i_x)
		{
			this->location.setX(i_x);
		}

		inline void Monster::setYLocation(int i_y)
		{
			this->location.setY(i_y);
		}
	}
}
