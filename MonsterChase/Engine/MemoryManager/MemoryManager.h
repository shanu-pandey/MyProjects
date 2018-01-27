#pragma once
#include "HeapManager.h"

namespace Engine
{
	namespace MemoryManager
	{
		class HeapControl
		{
		public:
			HeapManager* GetCurrentHeap();
			void Init();
			void ShutDown();

		private:
			HeapManager *p_memory;
		};
	}
}