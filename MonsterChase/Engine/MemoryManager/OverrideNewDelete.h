#pragma once
#include "HeapManager.h"


inline void* operator new(size_t i_size, Engine::MemoryManager::HeapManager *i_memory);
inline void operator delete(void* i_pointer, Engine::MemoryManager::HeapManager *i_memory);
inline void* operator new[](size_t i_size, Engine::MemoryManager::HeapManager *i_memory);
inline void operator delete[](void* i_pointer, Engine::MemoryManager::HeapManager *i_memory);
inline void* operator new(size_t i_size, size_t i_alignment, Engine::MemoryManager::HeapManager *i_memory);
void* operator new(size_t i_size);
void* operator new[](size_t i_size);

#include "OverrideNewDelete-inl.h"