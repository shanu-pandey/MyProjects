#pragma once

#include "../Math/Point2D.h"
#include "../GameObject.h"


namespace Engine
{
	class RandomController : Engine::GameObject
	{
	public:
		RandomController() { }

		void Move(Engine::Math::Point2D *i_monsterLocation) override
		{
			i_monsterLocation->setX(rand() % 10 + 1);
			i_monsterLocation->setY(rand() % 10 + 1);
		}

		int xGetPosition(Engine::Math::Point2D *i_actor) override
		{
			return i_actor->getX();
		}

		int yGetPosition(Engine::Math::Point2D *i_actor) override
		{
			return i_actor->getY();
		}
	};
}