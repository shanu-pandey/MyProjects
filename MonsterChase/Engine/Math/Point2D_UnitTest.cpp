#include "Point2D.h"

bool Point2DUnitTest()
{
	const Engine::Math::Point2D i_vector1(1, 2);
	const Engine::Math::Point2D i_vector2(5, 6);
	Engine::Math::Point2D o_vector;

	o_vector = i_vector1 + i_vector2;

	assert(i_vector1.getX() == 1 && i_vector2.getX() == 5);
	assert(i_vector1.getY() == 2 && i_vector2.getY() == 6);

	o_vector = i_vector1;
	assert(i_vector1.getX() == 1 && i_vector1.getY() == 2);

	o_vector += i_vector1;
	assert(i_vector1.getX() == 1 && i_vector1.getY() == 2);

	o_vector -= i_vector1;
	assert(i_vector1.getX() == 1 && i_vector1.getY() == 2);

	o_vector /= i_vector1;
	assert(i_vector1.getX() == 1 && i_vector1.getY() == 2);

	o_vector *= i_vector1;
	assert(i_vector1.getX() == 1 && i_vector1.getY() == 2);

	return true;
}