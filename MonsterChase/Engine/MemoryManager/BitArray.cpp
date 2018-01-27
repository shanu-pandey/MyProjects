#include "BitArray.h"
#include "assert.h"
#include "string.h"
#include "intrin.h"
#include "../DebugLogging/ConsolePrint.h"

namespace Engine
{
	namespace MemoryManager
	{
		BitArray::BitArray(size_t i_numBits)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::BitArray()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

			m_numBytes = i_numBits / bitsPerByte;
			m_pBits = new uint8_t[i_numBits / bitsPerByte];

			assert(m_pBits);

			memset(m_pBits, 1, i_numBits/bitsPerByte);
		}

		BitArray::~BitArray()
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::~BitArray()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

			if (m_pBits)
				delete[] m_pBits;
		}

		bool BitArray::AreAllClear(void) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::AreAllClear()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

#ifdef _Win64
			uint64_t *mask = reinterpret_cast<uint64_t*> (m_pBits);
#else
			uint32_t *mask = reinterpret_cast<uint32_t*> (m_pBits);
#endif // _Win64

			unsigned int i = 0;
			unsigned long index;
			unsigned char isNonzero;

			while (mask[i])
			{
#ifdef _Win64
				isNonzero = _BitScanForward64(&index, mask[i]);
#else
				isNonzero = _BitScanForward(&index, mask[i]);
#endif // _Win64

				if (isNonzero)
					return false;

				i++;				
			}
			return true;
		}

		bool BitArray::AreAllSet(void) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::AreAllSet()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG
			
			return (!(AreAllClear()));
		}

		bool BitArray::IsBitSet(size_t i_bitNumber) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::IsBitSet()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

			assert(i_bitNumber > 0 && i_bitNumber < m_numBytes * bitsPerByte, "Out of range");

			size_t arrayIndex = i_bitNumber / bitsPerByte;
			size_t offset = i_bitNumber % bitsPerByte;
			uint8_t mask = 1;
			mask = mask << offset;
			return !((m_pBits[arrayIndex] & mask) == 0x00);
		}
		
		bool BitArray::IsBitClear(size_t i_bitNumber) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::IsBitClear()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

			assert(i_bitNumber > 0 && i_bitNumber < m_numBytes * bitsPerByte, "Out of range");

			return !(IsBitSet(i_bitNumber));
		}

		bool BitArray::GetFirstSetBit(size_t & o_bitNumber) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::GetFirstSetBit()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

			size_t index = 0;

			while ((m_pBits[index] == 0x00) && index < m_numBytes)
				index++;

			unsigned long bitScanIndex;
			unsigned char isNonzero;

#ifdef _Win32
				isNonzero = _BitScanForward64(&bitScanIndex, m_pBits[index]);
#else
				isNonzero = _BitScanForward(&bitScanIndex, m_pBits[index]);
#endif // _Win64

				if (isNonzero)
				{
					size_t temp = index * bitsPerByte;
					o_bitNumber = temp + bitScanIndex;
					return true;
				}
				else
					return false;		
		}

		bool BitArray::GetFirstClearBit(size_t & o_bitNumber) const
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("BitArray::GetFirstClearBit()", __LINE__, __FILE__, "Engine::MemoryManager::BitArray");
#endif // DEBUG

			size_t index = 0;

			while ((m_pBits[index] == 0x00) && index < m_numBytes)
				index++;

			unsigned long bitScanIndex;
			unsigned char isNonzero;

#ifdef _Win64
			isNonzero = _BitScanForward64(&bitScanIndex, ~m_pBits[index]);
#else
			isNonzero = _BitScanForward(&bitScanIndex, ~m_pBits[index]);
#endif // _Win64

			if (isNonzero)
			{
				size_t temp = index * bitsPerByte;
				o_bitNumber = temp + bitScanIndex;
				return true;
			}
			else
				return false;
		}

	}
}