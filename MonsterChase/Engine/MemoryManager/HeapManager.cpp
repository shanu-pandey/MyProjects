#include "HeapManager.h"
#include "Malloc.h"
#include "ConsolePrint.h"
#include <stdint.h>
#include "Windows.h"

#define SUPPORTS_ALIGNMENT

namespace Engine
{
	namespace MemoryManager
	{
		HeapManager::HeapManager(size_t i_size)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("MemoryManager::HeapMmanager(size)", __LINE__, __FILE__, "MemoryManager");
#endif // _DEBUG
			
			BD_List = nullptr;
			totalMemory = i_size;
			alignment = 4;
			descriptorMemory = 48 * sizeof(BlockDescriptor);
			freeMemory = totalMemory - descriptorMemory;

			p_MainMemory = HeapAlloc(GetProcessHeap(), 0, totalMemory);

			p_DescriptorMemory = static_cast<void*>(static_cast<uint8_t*>(p_MainMemory) + freeMemory);
			//	p_FreeMemory = static_cast<void*>(static_cast<uint8_t*>(p_MainMemory));
			p_FreeMemory = p_MainMemory;

			BD_List = reinterpret_cast<BlockDescriptor*>(static_cast<uintptr_t*>(p_DescriptorMemory));
			BD_List->p_AllocatedMemoryLocation = p_FreeMemory;
			BD_List->isFree = true;
			BD_List->memorySize = freeMemory;
			BD_List->p_Next = nullptr;
			p_DescriptorMemory = reinterpret_cast<BlockDescriptor*>(static_cast<uintptr_t*>(p_DescriptorMemory)) + sizeof(BlockDescriptor*);
			descriptorMemory -= sizeof(BlockDescriptor);
		}

		HeapManager::HeapManager(void *memory, size_t i_size)
		{

#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("MemoryManager::HeapMmanager(size)", __LINE__, __FILE__, "MemoryManager");
#endif // _DEBUG

			totalMemory = i_size;
			alignment = 4;
			descriptorMemory = 2048 * 16;
			freeMemory = totalMemory - descriptorMemory;
			p_MainMemory = _aligned_malloc(totalMemory, alignment);
			p_DescriptorMemory = static_cast<void*>(static_cast<uintptr_t*>(p_MainMemory) + freeMemory);
			p_FreeMemory = static_cast<void*>(static_cast<uintptr_t*>(p_MainMemory));
			BD_List = nullptr;
		}

		HeapManager::HeapManager(void *i_memory, size_t i_size, size_t i_numDescriptors)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("MemoryManager::HeapMmanager(memory, size)", __LINE__, __FILE__, "MemoryManager");
#endif // _DEBUG

			BD_List = nullptr;
			totalMemory = i_size;
			alignment = 4;
			descriptorMemory = i_numDescriptors * sizeof(BlockDescriptor);
			freeMemory = totalMemory - descriptorMemory;

			p_MainMemory = i_memory;

			p_DescriptorMemory = static_cast<void*>(static_cast<uint8_t*>(p_MainMemory) + freeMemory);
			//	p_FreeMemory = static_cast<void*>(static_cast<uint8_t*>(p_MainMemory));
			p_FreeMemory = p_MainMemory;

			BD_List = reinterpret_cast<BlockDescriptor*>(static_cast<uintptr_t*>(p_DescriptorMemory));
			BD_List->p_AllocatedMemoryLocation = p_FreeMemory;
			BD_List->isFree = true;
			BD_List->memorySize = freeMemory;
			BD_List->p_Next = nullptr;
			p_DescriptorMemory = reinterpret_cast<BlockDescriptor*>(static_cast<uintptr_t*>(p_DescriptorMemory)) + sizeof(BlockDescriptor*);
			descriptorMemory -= sizeof(BlockDescriptor);
		}

		HeapManager::HeapManager(void *i_memory, size_t i_size, size_t i_numDescriptors, size_t i_alignment)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("MemoryManager::HeapMmanager(memory, size, alignment)", __LINE__, __FILE__, "MemoryManager");
#endif // _DEBUG

			totalMemory = i_size;
			alignment = i_alignment;
			descriptorMemory = i_numDescriptors * sizeof(BlockDescriptor);
			freeMemory = totalMemory - descriptorMemory;
			p_MainMemory = i_memory;
			p_DescriptorMemory = static_cast<void*>(static_cast<uintptr_t*>(p_MainMemory) + freeMemory);
			p_FreeMemory = static_cast<void*>(static_cast<uintptr_t*>(p_MainMemory));
			BD_List = nullptr;
		}

		HeapManager::~HeapManager()
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("MemoryManager::~HeapMmanager(memory, size, alignment)", __LINE__, __FILE__, "MemoryManager");
#endif // _DEBUG

		}

		void *HeapManager::Alloc(size_t i_size)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Alloc()", __LINE__, __FILE__, "HeapManager");
#endif // _DEBUG

			void *o_memory = nullptr;
			bool allocated = false;

			//alignment
			while (i_size % alignment != 0)
			{
				i_size++;
			}

			if (i_size > freeMemory)
			{
				o_memory = nullptr;
			}
			/*else if (BD_List == nullptr)
			{
			BD_List = reinterpret_cast<BlockDescriptor*>(static_cast<uint8_t*>(p_DescriptorMemory));
			BD_List->p_AllocatedMemoryLocation = p_FreeMemory;
			BD_List->memorySize = i_size;
			BD_List->isFree = false;
			BD_List->p_Next = nullptr;

			o_memory = BD_List->p_AllocatedMemoryLocation;

			p_FreeMemory = static_cast<bool*>(p_MainMemory) + BD_List->memorySize;
			freeMemory -= i_size;
			}*/
			else
			{
				BlockDescriptor *temp = BD_List;

				do
				{
					if (temp->isFree)
					{
						if (temp->memorySize >= i_size)
						{
							//allocate here

							o_memory = temp->p_AllocatedMemoryLocation;
							if (temp->p_Next != nullptr)
								HeapManager::CreateDescriptor(temp, i_size);

							temp->isFree = false;
							temp->memorySize = i_size;
							allocated = true;
							freeMemory -= i_size;
							p_FreeMemory = static_cast<uint8_t*>(o_memory) + i_size + guardbandBytes;

							if (temp->p_Next == nullptr)
								HeapManager::CreateDescriptor(temp);



							break;
						}
					}
					temp = temp->p_Next;

				} while (temp != nullptr);


				//for (; temp->p_Next != nullptr; temp = temp->p_Next)
				//{
				//	if (temp->isFree)
				//	{
				//		if (temp->memorySize >= i_size)
				//		{
				//			//allocate here
				//			o_memory = temp->p_AllocatedMemoryLocation;
				//			temp->isFree = false;
				//			temp->memorySize = i_size;
				//			allocated = true;
				//			break;
				//		}
				//	}
				//}

				//add new BD to the list and allocate
				//if (!allocated)
				//{
				//	temp->p_Next = temp + 1;//static_cast<BlockDescriptor*>(p_FreeMemory);
				//	temp = temp->p_Next;

				//	temp->p_AllocatedMemoryLocation = p_FreeMemory;
				//	temp->p_Next = nullptr;
				//	temp->memorySize = i_size;
				//	temp->isFree = false;

				//	o_memory = temp->p_AllocatedMemoryLocation;
				//	freeMemory -= i_size;
				//	p_FreeMemory = static_cast<uint8_t*>(p_FreeMemory) + i_size;
				//}
				//
			}

			return o_memory;
		}

		void *HeapManager::Alloc(size_t i_size, size_t i_alignment)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Alloc()", __LINE__, __FILE__, "HeapManager");
#endif // _DEBUG
			size_t usedInAlignment = 0;
			alignment = i_alignment;

			void *o_memory = nullptr;
			bool allocated = false;

			//alignment
			if (i_size % alignment != 0)
				i_size = i_size + alignment - (i_size % alignment);

			if (i_size > freeMemory)
			{
				o_memory = nullptr;
			}
			else
			{
				BlockDescriptor *temp = BD_List;

				do
				{
					if (temp->isFree)
					{
						if (temp->memorySize >= i_size)
						{
							//allocate here

							//align memory if not aligned
							while ((reinterpret_cast<uintptr_t>(temp->p_AllocatedMemoryLocation) & (alignment - 1)) != 0)
							{
								temp->p_AllocatedMemoryLocation = reinterpret_cast<void*>((static_cast<uint8_t*>(temp->p_AllocatedMemoryLocation)) + 1);
								usedInAlignment++;
							}


							o_memory = temp->p_AllocatedMemoryLocation;


							temp->isFree = false;
							temp->memorySize = i_size;
							allocated = true;
							freeMemory -= i_size;
							if (usedInAlignment >=4)
								p_FreeMemory = static_cast<uint8_t*>(o_memory) + i_size;
							else
								p_FreeMemory = static_cast<uint8_t*>(o_memory) + i_size + guardbandBytes;


							if (temp->p_Next == nullptr)
								HeapManager::CreateDescriptor(temp);

							break;
						}
					}
					temp = temp->p_Next;

				} while (temp != nullptr);

			}

			return o_memory;
		}

		bool HeapManager::Dealloc(void *i_UserMemory)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Dealloc()", __LINE__, __FILE__, "Engine::MemoryManager");
#endif // DEBUG

			BlockDescriptor *temp = BD_List;
			BlockDescriptor *prev = nullptr;
			bool deallocated = false;

			do
			{
				if (i_UserMemory == temp->p_AllocatedMemoryLocation)
				{
					temp->isFree = true;
					freeMemory += temp->memorySize;

					//Do Garbage Collection

					if (prev != nullptr)
					{
						if (prev->isFree)
							HeapManager::GarbageCollection(prev);
						else
							HeapManager::GarbageCollection(temp);
					}
					else
					{
						HeapManager::GarbageCollection(temp);
					}
					deallocated = true;
					break;
				}

				prev = temp;
				temp = temp->p_Next;
			} while (temp != nullptr);

			//for (; temp->p_Next != nullptr; temp = temp->p_Next)
			//{
			//	if (i_UserMemory == temp->p_AllocatedMemoryLocation)
			//	{
			//		temp->isFree = true;
			//		if (prev != nullptr)
			//		{
			//			if (prev->isFree)
			//				HeapManager::GarbageCollection(prev);
			//			else
			//				HeapManager::GarbageCollection(temp);
			//		}
			//		else
			//		{
			//			HeapManager::GarbageCollection(temp);
			//		}

			//		deallocated = true;
			//		freeMemory += temp->memorySize;
			//		/*if (prev != nullptr)
			//		{
			//		prev->p_Next = temp->p_Next;

			//		}*/
			//		break;
			//	}
			//	prev = temp;
			//}

			if (!deallocated)
			{
				if (i_UserMemory == temp->p_AllocatedMemoryLocation)
				{
					temp->isFree = true;
					freeMemory += temp->memorySize;
					//temp->memorySize = freeMemory;
					deallocated = true;
					if (temp->p_Next == nullptr)					//if last pointer, entire free memory is available for allocation
						temp->memorySize = freeMemory;
				}
			}
			return deallocated;
		}

		void HeapManager::GarbageCollection(BlockDescriptor *i_pFreeMemory)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("GarbageCollection()", __LINE__, __FILE__, "Engine::MemoryManager");
#endif // DEBUG

			if (i_pFreeMemory->p_Next != nullptr)
			{
				BlockDescriptor *p_nextBlock = i_pFreeMemory->p_Next;

				if (p_nextBlock->isFree)
				{
					i_pFreeMemory->p_Next = p_nextBlock->p_Next;
					i_pFreeMemory->memorySize += p_nextBlock->memorySize;
					HeapManager::GarbageCollection(i_pFreeMemory);
				}
			}
			else
			{
				i_pFreeMemory->memorySize = freeMemory;
			}
		}

		void HeapManager::Destroy()
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Destroy()", __LINE__, __FILE__, "HeapManager");
#endif // _DEBUG

		}

		size_t HeapManager::GetLargestFreeBlock(const HeapManager * i_pManager)
		{
			size_t largestFreeBlock = 0;
			BlockDescriptor *temp = i_pManager->BD_List;
			while (temp->p_Next != nullptr)
			{
				if (temp->isFree)
				{
					if (temp->memorySize > largestFreeBlock)
						largestFreeBlock = temp->memorySize;
				}
				temp = temp->p_Next;
			}
			return largestFreeBlock;
		}

		bool HeapManager::IsAllocated(const HeapManager * i_pManager, void * i_ptr)
		{
			bool isAllocated = false;
			BlockDescriptor *temp = i_pManager->BD_List;

			while (temp != nullptr)
			{
				if (temp->p_AllocatedMemoryLocation == i_ptr)
				{
					isAllocated = !(temp->isFree);
					break;
				}
				temp = temp->p_Next;
			}
			return isAllocated;
		}

		bool HeapManager::Contains(const HeapManager * i_pManager, void * i_ptr)
		{
			bool contains = false;
			BlockDescriptor *temp = i_pManager->BD_List;

			while (temp != nullptr)
			{
				if (temp->p_AllocatedMemoryLocation == i_ptr)
				{
					contains = true;
					break;
				}
				temp = temp->p_Next;
			}
			return contains;
		}

		void HeapManager::CreateDescriptor(BlockDescriptor *i_DescriptorList)
		{
			if (descriptorMemory < sizeof(BlockDescriptor))
			{
				p_DescriptorMemory = static_cast<void*>(static_cast<uint8_t*>(p_DescriptorMemory) - 2048 * sizeof(BlockDescriptor) - 100 * sizeof(BlockDescriptor));
			}

			//i_DescriptorList->p_Next = reinterpret_cast<BlockDescriptor*>(static_cast<uint8_t*>(p_DescriptorMemory));
			i_DescriptorList->p_Next = i_DescriptorList + 1;
			p_DescriptorMemory = reinterpret_cast<BlockDescriptor*>(static_cast<uint8_t*>(p_DescriptorMemory) + sizeof(BlockDescriptor));
			descriptorMemory -= sizeof(BlockDescriptor);
			i_DescriptorList = i_DescriptorList->p_Next;
			i_DescriptorList->p_AllocatedMemoryLocation = p_FreeMemory;
			i_DescriptorList->isFree = true;
			i_DescriptorList->memorySize = freeMemory;
			i_DescriptorList->p_Next = nullptr;
		}

		void HeapManager::CreateDescriptor(BlockDescriptor *i_DescriptorList, size_t size)
		{
			BlockDescriptor *current = i_DescriptorList;

			BlockDescriptor *newD = reinterpret_cast<BlockDescriptor*>(static_cast<uint8_t*>(p_DescriptorMemory));
			p_DescriptorMemory = reinterpret_cast<BlockDescriptor*>(static_cast<uint8_t*>(p_DescriptorMemory)) + sizeof(BlockDescriptor*);
			newD->p_Next = current->p_Next;
			current->p_Next = newD;
			newD->memorySize = current->memorySize - size;
			newD->isFree = true;
			newD->p_AllocatedMemoryLocation = static_cast<void*>(static_cast<uint8_t*>(current->p_AllocatedMemoryLocation) + size);

		}
	}
}
