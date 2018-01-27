#include "HeapManager.h"
#include "OverrideNewDelete.h"
#include "Malloc.h"


void* operator new(size_t i_size)
{
	const size_t 		sizeHeap = 1024 * 1024;
	const unsigned int 	numDescriptors = 2048;

	// Create a heap manager for my test heap.
	Engine::MemoryManager::HeapManager *pHeapManager = &Engine::MemoryManager::HeapManager(sizeHeap);
//	if (Engine::MemoryManager::HeapManager::p_CurrentHeap)
	return pHeapManager->Alloc(i_size);
}

void operator delete(void * i_ptr)
{
//	if (i_ptr)
//		_aligned_free(i_ptr);
}

void operator delete[](void * i_ptr)
{
//	if (i_ptr)
//		_aligned_free(i_ptr);
}

void* operator new[](size_t i_size)
{
	const size_t 		sizeHeap = 1024 * 1024;
	const unsigned int 	numDescriptors = 2048;
	// Create a heap manager for my test heap.
	Engine::MemoryManager::HeapManager *pHeapManager = &Engine::MemoryManager::HeapManager(sizeHeap);
	return pHeapManager->Alloc(i_size);
}