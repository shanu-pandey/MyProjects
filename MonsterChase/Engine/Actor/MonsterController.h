#pragma once

#include "../Math/Point2D.h"
#include "../GameObject.h"
#include <iostream>

namespace Engine
{
	class MonsterController : Engine::GameObject
	{
	public:
		MonsterController()  { }

		void Move(Engine::Math::Point2D *i_monsterLocation) override
		{
			if (i_monsterLocation->getX() == 10)
				i_monsterLocation->setX(0);
			else
				i_monsterLocation->setX(i_monsterLocation->getX() + 1);


			if (i_monsterLocation->getY() == 10)
				i_monsterLocation->setY(0);
			else
				i_monsterLocation->setY(i_monsterLocation->getY() + 1);
		}

		int xGetPosition(Engine::Math::Point2D *i_actor) override
		{
			return 	i_actor->getX();
		}

		int yGetPosition(Engine::Math::Point2D *i_actor) override
		{
			return 	i_actor->getY();
		}
	};
}