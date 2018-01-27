#include "Point2D.h"
#include "assert.h"
#pragma once

namespace Engine
{
	namespace Math
	{
		inline Point2D::Point2D()
		{
			this->x = 0;
			this->y = 0;
		}

		inline Point2D::Point2D(int i_x, int i_y)
		{
			assert(i_x != NULL);
			assert(i_y != NULL);

			this->x = i_x;
			this->y = i_y;
		}

		inline Point2D::Point2D(const Point2D & i_vector)
		{
			this->x = i_vector.x;
			this->y = i_vector.y;
		}

		inline Point2D & Point2D::operator=(const Point2D & i_vector)
		{
			x = i_vector.x;
			y = i_vector.y;
			return *this;
		}

		inline Point2D & Point2D::operator+=(const Point2D & i_vector)
		{
			x += i_vector.x;
			y += i_vector.y;

			return *this;
		}

		inline Point2D & Point2D::operator-=(const Point2D & i_vector)
		{
			x -= i_vector.x;
			y -= i_vector.y;

			return *this;
		}

		inline Point2D & Point2D::operator*=(const Point2D & i_vector)
		{
			x *= i_vector.x;
			y *= i_vector.y;

			return *this;
		}

		inline Point2D & Point2D::operator*=(int i_value)
		{
			x *= i_value;
			y *= i_value;

			return *this;
		}

		inline Point2D & Point2D::operator*=(float i_value)
		{
			x = int(x * i_value);
			y = int(y * i_value);

			return *this;
		}

		inline Point2D & Point2D::operator/=(const Point2D & i_vector)
		{
			x /= i_vector.x;
			y /= i_vector.y;

			return *this;
		}

		inline Point2D & Point2D::operator/=(int i_value)
		{
			x /= i_value;
			y /= i_value;

			return *this;
		}

		inline Point2D & Point2D::operator/=(float i_value)
		{
			x = int((float)x / i_value);
			y = int((float)y / i_value);

			return *this;
		}

		inline Point2D Point2D::operator-(void)
		{
			return(Point2D(-x, -y));
		}

		inline Point2D operator+(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return Point2D(i_lhs.getX() + i_rhs.getX(), i_lhs.getY() + i_rhs.getY());
		}

		inline Point2D operator+(const Point2D & i_lhs, int i_rhs)
		{
			return Point2D(i_lhs.getX() + i_rhs, i_lhs.getY() + i_rhs);
		}

		inline Point2D operator+(const Point2D & i_lhs, float i_rhs)
		{
			return Point2D(i_lhs.getX() + (int)i_rhs, i_lhs.getY() + (int)i_rhs);
		}

		inline Point2D operator-(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return Point2D(i_lhs.getX() - i_rhs.getX(), i_lhs.getY() - i_rhs.getY());
		}

		inline Point2D operator-(const Point2D & i_lhs, int i_rhs)
		{
			return Point2D(i_lhs.getX() - i_rhs, i_lhs.getY() - i_rhs);
		}

		inline Point2D operator-(const Point2D & i_lhs, float i_rhs)
		{
			return Point2D(i_lhs.getX() - (int)i_rhs, i_lhs.getY() - (int)i_rhs);
		}

		inline Point2D operator*(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return Point2D(i_lhs.getX() * i_rhs.getX(), i_lhs.getY() * i_rhs.getY());
		}

		inline Point2D operator*(const Point2D & i_lhs, int i_rhs)
		{
			return Point2D(i_lhs.getX() * i_rhs, i_lhs.getY() * i_rhs);
		}

		inline Point2D operator*(const Point2D & i_lhs, float i_rhs)
		{
			return Point2D(i_lhs.getX() * (int)i_rhs, i_lhs.getY() * (int)i_rhs);
		}

		inline Point2D operator/(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return Point2D(i_lhs.getX() / i_rhs.getX(), i_lhs.getY() / i_rhs.getY());
		}

		inline Point2D operator/(const Point2D & i_lhs, int i_rhs)
		{
			return Point2D(i_lhs.getX() / i_rhs, i_lhs.getY() / i_rhs);
		}

		inline Point2D operator/(const Point2D & i_lhs, float i_rhs)
		{
			return Point2D(i_lhs.getX() / (int)i_rhs, i_lhs.getY() / (int)i_rhs);
		}

		inline bool operator==(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return(i_lhs.getX() == i_rhs.getX() && i_lhs.getY() == i_rhs.getY());
		}

		inline bool operator!=(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return !operator==(i_lhs, i_rhs);
		}

		inline int dot(const Point2D & i_lhs, const Point2D & i_rhs)
		{
			return(i_lhs.getX() * i_rhs.getX() + i_lhs.getY() * i_rhs.getY());
		}
	}
}