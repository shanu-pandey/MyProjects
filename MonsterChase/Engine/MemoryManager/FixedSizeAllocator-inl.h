#pragma once
#include "FixedSizeAllocator.h"
#include "OverrideNewDelete.h"

#define GUARDBAND

namespace Engine
{
	namespace MemoryManager
	{
		//default constructor
		inline FixedSizeAllocator::FixedSizeAllocator()
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("FixedSizeAllocator()", __LINE__, __FILE__, "Engine::MemoryManager::FixedSizeAllocator");
#endif // DEBUG

			blockSize = 0;
			m_pAllocatedMemory = nullptr;
			totalBlocks = 0;
			totalMemory = 0;
			pBits = nullptr;
		}
		
		//standard constructor
		inline FixedSizeAllocator::FixedSizeAllocator(size_t i_blockSize, size_t i_totalBlocks)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("FixedSizeAllocator(i_blockSize, i_totalBlocks)", __LINE__, __FILE__, "FixedSizeAllocator");
#endif // DEBUG

			blockSize = i_blockSize;
			totalBlocks = i_totalBlocks;
			totalMemory = blockSize * totalBlocks;

			pBits = new BitArray(totalMemory);
			m_pAllocatedMemory = new uint8_t[totalBlocks];

		}

		//standard constructor with Heap Memory
		inline FixedSizeAllocator::FixedSizeAllocator(size_t i_blockSize, size_t i_totalBlocks, Engine::MemoryManager::HeapManager *p_iMyHeap)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("FixedSizeAllocator::FixedSizeAllocator(1, 2, 3)", __LINE__, __FILE__, "FSizeAllocator");
#endif // DEBUG

#ifdef GUARDBAND
			i_blockSize += 2 * guardbandBytes;
#endif GUARDBAND

			blockSize = i_blockSize;
			totalBlocks = i_totalBlocks;
			totalMemory = blockSize * totalBlocks;

			pBits = new(p_iMyHeap) BitArray(totalMemory);
			//m_pAllocatedMemory = =reinterpret_cast<uint8_t*> (p_iMyHeap->Alloc(totalMemory, 4));
			m_pAllocatedMemory = new(p_iMyHeap) uint8_t[totalMemory];
		}

		//destructor
		inline FixedSizeAllocator::~FixedSizeAllocator()
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("~FixedSizeAllocator()", __LINE__, __FILE__, "::FixedSizeAllocator");
#endif // DEBUG

			if (m_pAllocatedMemory)
			{
				pBits->~BitArray();
				delete pBits;
				delete m_pAllocatedMemory;
			}
		}

		inline bool FixedSizeAllocator::Contains(void * i_pMemory) {
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("FixedSizeAllocator::Contains()", __LINE__, __FILE__, "Engine::MemoryManager::FixedSizeAllocator");
#endif // DEBUG

			return ((i_pMemory >= m_pAllocatedMemory) && i_pMemory < m_pAllocatedMemory + totalMemory);
		}

	}
}
