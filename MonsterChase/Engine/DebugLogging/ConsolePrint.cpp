#ifdef DEBUG
#endif // DEBUG

#include <assert.h>		// for assert()
#include <stdarg.h>		// for va_<xxx>
#include <stdio.h>		// for vsprintf_s()
#include <Windows.h>	// for OutputDebugStringA(). Uggh.. this pulls in a lot of Windows specific stuff

namespace Engine
{
	namespace DebugLogging
	{
		void ConsolePrint(const char * i_fmt, ...)
		{
			assert(i_fmt);
			const size_t lenTemp = 256;
			char strTemp[lenTemp] = "DEBUG: ";
			//strcat_s(strTemp, i_fmt);

			const size_t lenOutput = lenTemp + 32;
			char strOutput[lenOutput];

			// define a variable argument list variable 
			va_list args;

			// initialize it. second parameter is variable immediately
			// preceeding variable arguments
			va_start(args, i_fmt);
			int line = va_arg(args, int);
			char* file = va_arg(args, char*);
			char* origin = va_arg(args, char*);

			char c[sizeof(int)];
			sprintf_s(c, "%d", line);

			strcat_s(strTemp, "\nFunction Name: ");
			strcat_s(strTemp, i_fmt);
			strcat_s(strTemp, "\nLine Number: ");
			strcat_s(strTemp, c);
			strcat_s(strTemp, "\nFile Location: ");
			strcat_s(strTemp, file);
			strcat_s(strTemp, "\nSystem of Origin: ");
			strcat_s(strTemp, origin);
			strcat_s(strTemp, "\n");

			// (safely) print our formatted string to a char buffer
			vsprintf_s(strOutput, lenOutput, strTemp, args);
			va_end(args);
			OutputDebugStringA(strOutput);
		}
	}
}

