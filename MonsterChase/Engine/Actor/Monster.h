#pragma once
#include "../Math/Point2D.h"

namespace Engine
{
	namespace Actor
	{
		class Monster
		{
		public:

			//default constructor
			Monster()
			{
				pName = nullptr;
				location = Engine::Math::Point2D();
			}

			//standard constructor
			Monster(char *i_name, Engine::Math::Point2D i_location)
			{
				pName = i_name;
				location = i_location;
			}

			//copy constructor
			Monster(const Monster & i_other) :
				pName(_strdup(i_other.pName ? i_other.pName : "Unmaned")),
				location(i_other.location)
			{
			}


			//move constructor
			Monster(Monster && i_other) :
				pName(i_other.pName),
				location(i_other.location)
			{
				i_other.pName = nullptr;
			}

			inline void Move(Engine::Math::Point2D i_location);
			inline int getXLocation();
			inline int getYLocation();
			inline char *GetName();
			inline void setXLocation(int i_x);
			inline void setYLocation(int i_y);

		private:
			char *pName;
			Engine::Math::Point2D location;
		};
	}
}
#include "Monster-inl.h"