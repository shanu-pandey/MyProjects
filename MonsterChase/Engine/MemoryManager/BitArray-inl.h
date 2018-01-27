#pragma once
#include "BitArray.h"
#include "string.h"
#include "intrin.h"

namespace Engine
{
	namespace MemoryManager
	{
		inline void BitArray::ClearAll()
		{
			memset(m_pBits, 0, sizeof(*m_pBits));
		}

		inline void BitArray::SetAll(void)
		{
			memset(m_pBits, 1, sizeof(*m_pBits));
		}

		inline void BitArray::ToggleBit(size_t i_bitNumber)
		{
			m_pBits[i_bitNumber] = ~m_pBits[i_bitNumber];
		}

		inline bool BitArray::operator[](size_t i_index) const
		{
			return IsBitSet(i_index);
		}
	}
}
