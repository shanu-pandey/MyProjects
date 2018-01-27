#pragma once
#include "MemoryManager.h"

namespace Engine
{
	namespace MemoryManager
	{
		class BitArray
		{
		public:
			BitArray(size_t i_numBits);
			~BitArray();

			inline void ClearAll(void);
			inline void SetAll(void);

			bool AreAllClear(void) const;
			bool AreAllSet(void) const;

			bool IsBitSet(size_t i_bitNumber) const;
			bool IsBitClear(size_t i_bitNumber) const;

			inline void ToggleBit(size_t i_bitNumber);

			bool GetFirstClearBit(size_t & o_bitNumber) const;
			bool GetFirstSetBit(size_t & o_bitNumber) const;

			inline bool operator[](size_t i_index) const;

		private:
			uint8_t *m_pBits;
			const size_t bitsPerByte = 8;
			size_t m_numBytes;
		};
	}
}
#include "BitArray-inl.h"