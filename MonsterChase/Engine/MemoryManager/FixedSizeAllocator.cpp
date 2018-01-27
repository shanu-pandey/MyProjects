#include "FixedSizeAllocator.h"
#include "assert.h"

#define GUARDBAND

namespace Engine
{
	namespace MemoryManager
	{
		void *FixedSizeAllocator::Alloc(size_t i_size)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("FixedSizeAllocator::Alloc()", __LINE__, __FILE__, "::FixedSizeAllocator");
#endif // DEBUG

			assert(i_size != 0, "Cannot allocate 0 bytes");

			size_t i_firstAvailable;
			uint8_t *o_Memeory = nullptr;

			if (pBits->GetFirstSetBit(i_firstAvailable))
			{
				pBits->ToggleBit(i_firstAvailable);

				o_Memeory = m_pAllocatedMemory + (i_firstAvailable * blockSize);
#ifdef GUARDBAND
				o_Memeory = AddGuardBand_start(o_Memeory);
				uint8_t* temp = o_Memeory;
				temp += blockSize;
				AddGuardBand_end(temp);

#endif // GUARDBAND

				return o_Memeory;
			}
			else
				return nullptr;
		}

		bool FixedSizeAllocator::Free(void *i_pMemory) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("FixedSizeAllocator::Free()", __LINE__, __FILE__, "::FixedSizeAllocator");
#endif // DEBUG

			assert(i_pMemory);

#ifdef GUARDBAND
			uint8_t *p_Memory = reinterpret_cast<uint8_t*>(i_pMemory);
			size_t index = (p_Memory - 4 - m_pAllocatedMemory) / blockSize;
			size_t offset = (p_Memory - 4 - m_pAllocatedMemory) % blockSize;

#else
			uint8_t *p_Memory = reinterpret_cast<uint8_t*>(i_pMemory);
			size_t index = (p_Memory - m_pAllocatedMemory) / blockSize;
			size_t offset = (p_Memory - m_pAllocatedMemory) % blockSize;

#endif GUARDBAND
			

			pBits->ToggleBit(index);
			return true;
		}

		uint8_t* FixedSizeAllocator::AddGuardBand_start(uint8_t *i_Memory)
		{
			i_Memory[0] = guardbandValues[0];
			i_Memory[1] = guardbandValues[1];
			i_Memory[2] = guardbandValues[2];
			i_Memory[3] = guardbandValues[3];
			i_Memory += 4;

			return i_Memory;
		}

		void FixedSizeAllocator::AddGuardBand_end(uint8_t *i_Memory)
		{
			i_Memory[0] = guardbandValues[0];
			i_Memory[1] = guardbandValues[1];
			i_Memory[2] = guardbandValues[2];
			i_Memory[3] = guardbandValues[3];
		}

	}
}