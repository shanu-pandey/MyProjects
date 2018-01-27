#include "HeapManager.h"
#include "OverrideNewDelete.h"
#include "Malloc.h"
#include "../DebugLogging/ConsolePrint.h"


inline void* operator new(size_t i_size, Engine::MemoryManager::HeapManager *i_memory)
{
#ifdef _DEBUG
	Engine::DebugLogging::ConsolePrint("Engine OverrideNewDelete", __LINE__, __FILE__, "OverrideNewDelete");
#endif // _DEBUG
	return i_memory->Alloc(i_size);
}

inline void operator delete(void* i_pointer, Engine::MemoryManager::HeapManager *i_memory)
{
#ifdef _DEBUG
	Engine::DebugLogging::ConsolePrint("Engine OverrideNewDelete", __LINE__, __FILE__, "OverrideNewDelete");
#endif // _DEBUG
	if (i_pointer)
		bool a = i_memory->Dealloc(i_pointer);
}

inline void* operator new[](size_t i_size, Engine::MemoryManager::HeapManager *i_memory)
{
#ifdef _DEBUG
	Engine::DebugLogging::ConsolePrint("Engine OverrideNewDelete", __LINE__, __FILE__, "OverrideNewDelete");
#endif // _DEBUG
	return i_memory->Alloc(i_size);
}

inline void operator delete[](void* i_pointer, Engine::MemoryManager::HeapManager *i_memory)
{
#ifdef _DEBUG
	Engine::DebugLogging::ConsolePrint("Engine OverrideNewDelete", __LINE__, __FILE__, "OverrideNewDelete");
#endif // _DEBUG
	if (i_pointer)
		bool a = i_memory->Dealloc(i_pointer);
}

inline void* operator new(size_t i_size, size_t i_alignment, Engine::MemoryManager::HeapManager *i_memory)
{
#ifdef _DEBUG
	Engine::DebugLogging::ConsolePrint("Engine OverrideNewDelete", __LINE__, __FILE__, "OverrideNewDelete");
#endif // _DEBUG
	return i_memory->Alloc(i_size, i_alignment);
}