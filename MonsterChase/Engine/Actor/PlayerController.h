#pragma once

#include "../Math/Point2D.h"
#include "../GameObject.h"

namespace Engine
{
	class PlayerController : Engine::GameObject
	{
	public:
		PlayerController();

		void Move(Engine::Math::Point2D *i_playerLocation) override
		{
			if (i_playerLocation->getX() == 10)
				i_playerLocation->setX(0);
			else
				i_playerLocation->setX(i_playerLocation->getX() + 1);


			if (i_playerLocation->getY() == 10)
				i_playerLocation->setY(0);
			else
				i_playerLocation->setY(i_playerLocation->getY() + 1);		
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