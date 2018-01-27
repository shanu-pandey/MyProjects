/*
By: Shantanu Pandey
UID: u1139622
Graduate Student, EAE
University of Utah
*/

#include <conio.h>
#include <iostream>
#include <vector>
using namespace std;
#include <assert.h>
#include <ConsolePrint.h>
#include <HeapManager.h>
#include "OverrideNewDelete.h"

#include "Windows.h"
#include "stdio.h"
#include "FixedSizeAllocator.h"


/*
Joe's Unit test for memory manager
*/

#define SUPPORTS_ALIGNMENT

bool HeapManager_UnitTest()
{
	const size_t 		sizeHeap = 1024 * 1024;
	const unsigned int 	numDescriptors = 2048;

	// Allocate memory for my test heap.
	void * pHeapMemory = HeapAlloc(GetProcessHeap(), 0, sizeHeap);
	assert(pHeapMemory);

	// Create a heap manager for my test heap.
	Engine::MemoryManager::HeapManager  *pHeapManager = &Engine::MemoryManager::HeapManager(pHeapMemory, sizeHeap, numDescriptors);
	
	//= CreateHeapManager(pHeapMemory, sizeHeap, numDescriptors);
	assert(pHeapManager);

	if (pHeapManager == NULL)
	return false;
#pragma region FSA Declaration
	//Create FSA 8-byte
	Engine::MemoryManager::FixedSizeAllocator *pFixedSizeAllocator8 = new Engine::MemoryManager::FixedSizeAllocator(8, 1024, pHeapManager);
	//Create FSA 16-byte
	Engine::MemoryManager::FixedSizeAllocator *pFixedSizeAllocator16 = new Engine::MemoryManager::FixedSizeAllocator(16, 1024, pHeapManager);
	//Create FSA 32-byte
	Engine::MemoryManager::FixedSizeAllocator *pFixedSizeAllocator32 = new Engine::MemoryManager::FixedSizeAllocator(32, 1024, pHeapManager);
	//Create FSA 64-byte
	Engine::MemoryManager::FixedSizeAllocator *pFixedSizeAllocator64 = new Engine::MemoryManager::FixedSizeAllocator(64, 1024, pHeapManager);
#pragma endregion

#ifdef TEST_SINGLE_LARGE_ALLOCATION
	// This is a test I wrote to check to see if using the whole block if it was almost consumed by 
	// an allocation worked. Also helped test my ShowFreeBlocks() and ShowOutstandingAllocations().
	{
#ifdef SUPPORTS_SHOWFREEBLOCKS
		ShowFreeBlocks(pHeapManager);
#endif // SUPPORTS_SHOWFREEBLOCKS

		size_t largestBeforeAlloc = GetLargestFreeBlock(pHeapManager);
		//void * pPtr = alloc(pHeapManager, largestBeforeAlloc - HeapManager::s_MinumumToLeave);
		void *pPtr = pHeapManager->Alloc(largestBeforeAlloc);
		if (pPtr)
		{
#if defined(SUPPORTS_SHOWFREEBLOCKS) || defined(SUPPORTS_SHOWOUTSTANDINGALLOCATIONS)
			printf("After large allocation:\n");
#ifdef SUPPORTS_SHOWFREEBLOCKS
			//ShowFreeBlocks(pHeapManager);
#endif // SUPPORTS_SHOWFREEBLOCKS
#ifdef SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
			//ShowOutstandingAllocations(pHeapManager);
#endif // SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
			printf("\n");
#endif

			size_t largestAfterAlloc = GetLargestFreeBlock(pHeapManager);
			bool success = Contains(pHeapManager, pPtr) && IsAllocated(pHeapManager, pPtr);
			assert(success);

			success = pHeapManager->Dealloc(pPtr);
			assert(success);

			//Collect(pHeapManager);

#if defined(SUPPORTS_SHOWFREEBLOCKS) || defined(SUPPORTS_SHOWOUTSTANDINGALLOCATIONS)
			printf("After freeing allocation and garbage collection:\n");
#ifdef SUPPORTS_SHOWFREEBLOCKS
			//ShowFreeBlocks(pHeapManager);
#endif // SUPPORTS_SHOWFREEBLOCKS
#ifdef SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
			//ShowOutstandingAllocations(pHeapManager);
#endif // SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
			printf("\n");
#endif

			size_t largestAfterCollect = GetLargestFreeBlock(pHeapManager);
		}
	}
#endif

	std::vector<void *> AllocatedAddresses;

	long	numAllocs = 0;
	long	numFrees = 0;
	long	numCollects = 0;

	// allocate memory of random sizes up to 1024 bytes from the heap manager
	// until it runs out of memory
	do
	{
		const size_t		maxTestAllocationSize = 1024;

		size_t			sizeAlloc = 1 + (rand() & (maxTestAllocationSize - 1));

#ifdef SUPPORTS_ALIGNMENT
		// pick an alignment
		const unsigned int	alignments[] = { 4, 8, 16, 32, 64 };

		const unsigned int	index = rand() % (sizeof(alignments) / sizeof(alignments[0]));

		const unsigned int	alignment = alignments[index];
		void *pPtr = nullptr;

#pragma region Using FSA
		if (sizeAlloc <= 8)
			pPtr = pFixedSizeAllocator8->Alloc(sizeAlloc);
		else if (sizeAlloc > 8 && sizeAlloc <=16)
			pPtr = pFixedSizeAllocator16->Alloc(sizeAlloc);
		else if (sizeAlloc > 16 && sizeAlloc <= 32)
			pPtr = pFixedSizeAllocator32->Alloc(sizeAlloc);
		else if (sizeAlloc > 32 && sizeAlloc <=64)
			pPtr = pFixedSizeAllocator64->Alloc(sizeAlloc);
		else
			pPtr = pHeapManager->Alloc(sizeAlloc, alignment);
#pragma endregion
		//void * pPtr = pHeapManager->Alloc(sizeAlloc, alignment);

		// check that the returned address has the requested alignment

#pragma region Assert Alignment when not in FSA

		
		if (pFixedSizeAllocator8->Contains(pPtr) || pFixedSizeAllocator16->Contains(pPtr) || pFixedSizeAllocator32->Contains(pPtr)
			|| pFixedSizeAllocator64->Contains(pPtr))
		{
			//don't assert alignments if allocated on FSAs
		}
		else if (pHeapManager->Contains(pHeapManager, pPtr))
		{
			if ((reinterpret_cast<uintptr_t>(pPtr) & (alignment - 1)) != 0)
			{
				assert((reinterpret_cast<uintptr_t>(pPtr) - 4 & (alignment - 1)) == 0);
			}
		}
			//assert((reinterpret_cast<uintptr_t>(pPtr) & (alignment - 1)) == 0);
#pragma endregion
		
#else
		void * pPtr = pHeapManager->Alloc(sizeAlloc);
#endif // SUPPORT_ALIGNMENT

		// if allocation failed see if garbage collecting will create a large enough block
		if (pPtr == nullptr)
		{

#ifdef SUPPORTS_ALIGNMENT
			pPtr = pHeapManager->Alloc(sizeAlloc);// , alignment);
#else
			pPtr = pHeapManager->Alloc(sizeAlloc);
#endif // SUPPORT_ALIGNMENT

			// if not we're done. go on to cleanup phase of test
			if (pPtr == nullptr)
				break;
		}

		AllocatedAddresses.push_back(pPtr);
		numAllocs++;

		// randomly free and/or garbage collect during allocation phase
		const unsigned int freeAboutEvery = 10;
		const unsigned int garbageCollectAboutEvery = 40;

		if (!AllocatedAddresses.empty() && ((rand() % freeAboutEvery) == 0))
		{
			void * pPtr = AllocatedAddresses.back();
			AllocatedAddresses.pop_back();

#pragma region Check FSA Contains
			bool success = false;
			
			if (pFixedSizeAllocator8->Contains(pPtr))
			{
				success = pFixedSizeAllocator8->Free(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator16->Contains(pPtr))
			{
				success = pFixedSizeAllocator16->Free(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator32->Contains(pPtr))
			{
				success = pFixedSizeAllocator32->Free(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator64->Contains(pPtr))
			{
				success = pFixedSizeAllocator64->Free(pPtr);
				assert(success);
			}
			else if (pHeapManager->Contains(pHeapManager, pPtr))
			{
				success = pHeapManager->IsAllocated(pHeapManager, pPtr);
				assert(success);
				success = pHeapManager->Dealloc(pPtr);
				assert(success);
			}
#pragma endregion
			//bool success = pHeapManager->Contains(pHeapManager, pPtr) && pHeapManager->IsAllocated(pHeapManager, pPtr);
           	//assert(success);
			//success = pHeapManager->Dealloc(pPtr);
			//assert(success);

			numFrees++;
		}

		if ((rand() % garbageCollectAboutEvery) == 0)
		{
			numCollects++;
		}

	} while (1);

#if defined(SUPPORTS_SHOWFREEBLOCKS) || defined(SUPPORTS_SHOWOUTSTANDINGALLOCATIONS)
	printf("After exhausting allocations:\n");
#ifdef SUPPORTS_SHOWFREEBLOCKS
	ShowFreeBlocks(pHeapManager);
#endif // SUPPORTS_SHOWFREEBLOCKS
#ifdef SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
	ShowOutstandingAllocations(pHeapManager);
#endif // SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
	printf("\n");
#endif

	// now free those blocks in a random order
	if (!AllocatedAddresses.empty())
	{
		// randomize the addresses
		//std::random_shuffle(AllocatedAddresses.begin(), AllocatedAddresses.end());

		// return them back to the heap manager
		while (!AllocatedAddresses.empty())
		{
			void * pPtr = AllocatedAddresses.back();
			AllocatedAddresses.pop_back();

#pragma region Check FSA Contains
			bool success = false;
			if (pHeapManager->Contains(pHeapManager, pPtr))
			{
				success = pHeapManager->IsAllocated(pHeapManager, pPtr);
				assert(success);
				success = pHeapManager->Dealloc(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator8->Contains(pPtr))
			{
				success = pFixedSizeAllocator8->Free(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator16->Contains(pPtr))
			{
				success = pFixedSizeAllocator16->Free(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator32->Contains(pPtr))
			{
				success = pFixedSizeAllocator32->Free(pPtr);
				assert(success);
			}
			else if (pFixedSizeAllocator64->Contains(pPtr))
			{
				success = pFixedSizeAllocator64->Free(pPtr);
				assert(success);
			}
#pragma endregion
			/*bool success = pHeapManager->Contains(pHeapManager, pPtr) && pHeapManager->IsAllocated(pHeapManager, pPtr);
			assert(success);

			success = pHeapManager->Dealloc(pPtr);
			assert(success);*/
		}

#if defined(SUPPORTS_SHOWFREEBLOCKS) || defined(SUPPORTS_SHOWOUTSTANDINGALLOCATIONS)
		printf("After freeing allocations:\n");
#ifdef SUPPORTS_SHOWFREEBLOCKS
		ShowFreeBlocks(pHeapManager);
#endif // SUPPORTS_SHOWFREEBLOCKS

#ifdef SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
		ShowOutstandingAllocations(pHeapManager);
#endif // SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
		printf("\n");
#endif

		// do garbage collection - automatically done after delete
		//Collect(pHeapManager);
		// our heap should be one single block, all the memory it started with

#if defined(SUPPORTS_SHOWFREEBLOCKS) || defined(SUPPORTS_SHOWOUTSTANDINGALLOCATIONS)
		printf("After garbage collection:\n");
#ifdef SUPPORTS_SHOWFREEBLOCKS
		ShowFreeBlocks(pHeapManager);
#endif // SUPPORTS_SHOWFREEBLOCKS

#ifdef SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
		ShowOutstandingAllocations(pHeapManager);
#endif // SUPPORTS_SHOWOUTSTANDINGALLOCATIONS
		printf("\n");
#endif

		// do a large test allocation to see if garbage collection worked
		void * pPtr = pHeapManager->Alloc(sizeHeap / 2);
		assert(pPtr);

		if (pPtr)
		{
			bool success = pHeapManager->Contains(pHeapManager, pPtr) && pHeapManager->IsAllocated(pHeapManager, pPtr);
			assert(success);

			success = pHeapManager->Dealloc(pPtr);
			assert(success);

		}
	}

	pHeapManager->Destroy();

	HeapFree(GetProcessHeap(), 0, pHeapMemory);

	// we succeeded
	return true;
}

void FSATest()
{
	//Updated the unit test to use FSA for 8/16/32/64 byte allocations	
	if (HeapManager_UnitTest())
		cout << "Passed";

}

int main()
{
#ifdef _DEBUG
	Engine::DebugLogging::ConsolePrint("main()", __LINE__, __FILE__, "Game");
#endif // DEBUG
	
	FSATest();
	_getch();
	return 0;
}