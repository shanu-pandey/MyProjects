#pragma once

namespace Engine
{
	namespace Math
	{
		class Point2D
		{
		public:
			inline Point2D();
			inline Point2D(int x_coordinate, int y_coordinate);
			inline Point2D(const Point2D & i_vector);
			inline Point2D & Point2D::operator=(const Point2D & i_vector);
			
			int getX() const { return x; }
			int getY() const { return y; }
			 
			void setX(const int x_coordiante) { x = x_coordiante; }
			void setY(const int y_coordiante) { y = y_coordiante; }

			inline Point2D & operator+=(const Point2D & i_vector);
			inline Point2D & operator-=(const Point2D & i_vector);
			
			inline Point2D & operator*=(const Point2D & i_vector);
			inline Point2D & operator*=(int i_value);
			inline Point2D & operator*=(float i_value);

			inline Point2D & operator/=(const Point2D & i_vector);
			inline Point2D & operator/=(int i_value);
			inline Point2D & operator/=(float i_value);

			inline Point2D operator-(void);

			static const Point2D Zero;

		private:
			int x, y;
		};

		inline Point2D operator+(const Point2D & i_lhs, const Point2D & i_rhsy);
		inline Point2D operator+(const Point2D & i_lhs, int i_rhs);
		inline Point2D operator+(const Point2D & i_lhs, float i_rhs);

		inline Point2D operator-(const Point2D & i_lhs, const Point2D & i_rhsy);
		inline Point2D operator-(const Point2D & i_lhs, int i_rhs);
		inline Point2D operator-(const Point2D & i_lhs, float i_rhs);

		inline Point2D operator*(const Point2D & i_lhs, const Point2D & i_rhsy);
		inline Point2D operator*(const Point2D & i_lhs, int i_rhs);
		inline Point2D operator*(const Point2D & i_lhs, float i_rhs);

		inline Point2D operator/(const Point2D & i_lhs, const Point2D & i_rhsy);
		inline Point2D operator/(const Point2D & i_lhs, int i_rhs);
		inline Point2D operator/(const Point2D & i_lhs, float i_rhs);

		inline bool operator==(const Point2D & i_lhs, const Point2D & i_rhs);
		
		inline bool operator!=(const Point2D & i_lhs, const Point2D & i_rhs);
		
		inline int dot(const Point2D & i_lhs, const Point2D & i_rhs);
	}
}
#include "Point2d-inl.h"

