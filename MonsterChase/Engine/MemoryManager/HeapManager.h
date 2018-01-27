#pragma once
#include <stdint.h>

#define __GUARDBAND

namespace Engine
{
	namespace MemoryManager
	{
		struct  BlockDescriptor
		{
			void *p_AllocatedMemoryLocation;
			BlockDescriptor *p_Next;
			bool isFree;
			size_t memorySize;
		};

		class HeapManager
		{
		public:
			HeapManager(size_t size);
			HeapManager(void *memory, size_t size);
			HeapManager(void *memory, size_t size, size_t i_numDescriptors);
			HeapManager(void *memory, size_t size, size_t i_numDescriptors, size_t alignment);
			~HeapManager();
			void *Alloc(size_t i_size);
			void *Alloc(size_t i_size, size_t alignment);
			bool Dealloc(void *i_UserMemory);
			void GarbageCollection(BlockDescriptor* i_FreeMemory);
			void Destroy();
			
			size_t GetLargestFreeBlock(const HeapManager * i_pManager);
			bool IsAllocated(const HeapManager * i_pManager, void * i_ptr);
			bool Contains(const HeapManager * i_pManager, void * i_ptr);
			void CreateDescriptor(BlockDescriptor * i_pManager);
			void CreateDescriptor(BlockDescriptor * i_pManager, size_t i_size);
			void *p_MainMemory;

			inline size_t GetTotalFreeMemory(const HeapManager * i_pManager){
				return i_pManager->freeMemory;
			}

#ifdef __GUARDBAND
			const uint8_t guardbandValues[4] = { 0xde, 0xad, 0xbe, 0xef }; // 0xdeadbeef
			const size_t guardbandBytes = sizeof(guardbandValues);
#endif

		private:
			
			void *p_DescriptorMemory;
			void *p_FreeMemory;
			//void *p_CurrentHeap;

			BlockDescriptor *BD_List;

			size_t totalMemory;
			size_t descriptorMemory;
			size_t alignment;
			size_t freeMemory;
		};
	};
}