#pragma once
#include "BitArray.h"
#include "HeapManager.h"
#include "../DebugLogging/ConsolePrint.h"
#include "OverrideNewDelete.h"

namespace Engine
{
	namespace MemoryManager
	{
		class FixedSizeAllocator
		{
		public:
			//default constructor
			inline FixedSizeAllocator();

			//Copy Constructor
			FixedSizeAllocator(FixedSizeAllocator & i_other) :blockSize(i_other.blockSize),
				totalBlocks(i_other.totalBlocks),
				pBits(i_other.pBits),
				totalMemory(i_other.totalMemory),
				m_pAllocatedMemory(i_other.m_pAllocatedMemory)
			{
#ifdef _DEBUG
				Engine::DebugLogging::ConsolePrint("FixedSizeAllocator(<Copy Constructor>)", __LINE__, __FILE__, "FixedSizeAllocator");
#endif // DEBUG

			}

			//Move Constructor		
			FixedSizeAllocator(FixedSizeAllocator && i_other) :blockSize(i_other.blockSize),
				totalBlocks(i_other.totalBlocks),
				pBits(i_other.pBits),
				totalMemory(i_other.totalMemory),
				m_pAllocatedMemory(i_other.m_pAllocatedMemory)
			{
#ifdef _DEBUG
				Engine::DebugLogging::ConsolePrint("FixedSizeAllocator(<Move Constructor>)", __LINE__, __FILE__, "FixedSizeAllocator");
#endif // DEBUG

			}
			
			//standard constructor
			inline FixedSizeAllocator(size_t i_blockSize, size_t i_totalBlocks);
			
			//standard constructor with Heap Memory
			inline FixedSizeAllocator(size_t i_blockSize, size_t i_totalBlocks, Engine::MemoryManager::HeapManager *p_iMyHeap);

			//destructor
			inline ~FixedSizeAllocator();

			void *Alloc(size_t i_size);
			bool Free(void *i_pMemory) const;
			inline bool Contains(void * i_pMemory);

		private:
			size_t blockSize;
			size_t totalMemory;
			size_t totalBlocks;
			BitArray *pBits;
			uint8_t *m_pAllocatedMemory;
			const uint8_t guardbandValues[4] = { 0xde, 0xad, 0xbe, 0xef }; // 0xdeadbeef
			const size_t guardbandBytes = sizeof(guardbandValues);

			uint8_t* AddGuardBand_start(uint8_t *i_Memory);
			void AddGuardBand_end(uint8_t *i_Memory);
		};
	}
}
#include "FixedSizeAllocator-inl.h"