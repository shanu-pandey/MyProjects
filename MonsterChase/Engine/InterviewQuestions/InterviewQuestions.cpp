#include "InterviewQuestions.h"
#include "assert.h"
#include "../DebugLogging/ConsolePrint.h"
namespace Engine
{
	namespace Interview
	{
		bool IfCircular(cList* i_list)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Interview Questions", __LINE__, __FILE__, "IfCircular()");
#endif // _DEBUG
			assert(i_list == nullptr);

			bool o_result = false;
			cList *pCopyList = i_list;
			cList *pNext1 = nullptr;
			cList *pNext2 = nullptr;
			while (i_list->pNext)
			{
				pNext1 = i_list->pNext;
				pNext2 = i_list->pNext->pNext;

				if (pNext1 == pNext2)
				{
					o_result = true;
					break;
				}
				i_list = i_list->pNext;
			}
			return o_result;
		}

		bool IsPalindrome(const char* i_string)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Interview Questions", __LINE__, __FILE__, "IsPalindrom()");
#endif // _DEBUG
			assert(i_string);

			bool o_result = false;
			char* first = &(const_cast<char*>(i_string))[0];
			char* copy = const_cast<char*>(i_string);
			char* last = nullptr;
			size_t count = 0;

			while (copy[0] != '\0')
			{
				last = copy++;
				count++;
			}

			for (int i = 0; i < count / 2; i++)
			{
				if (first[0] != *last)
					return o_result;

				first++;
				last--;
			}
			o_result = true;
			return o_result;
		}
		
		char* RemoveCharacter(const char* i_string, char i_character)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Interview Questions", __LINE__, __FILE__, "RemoveCharacter()");
#endif // _DEBUG
			assert(i_string);
			
			char* o_string = new char[50];
			int i = 0;
			while (i_string[0] != '\0')
			{
				if (i_string[0] == i_character)
					i_string++;
				else
				{
					o_string[i] = i_string[0];
					i_string++;
					i++;
				}
			}
			return o_string;
		}

		char* RemoveDuplicateSideBySide(char* i_string)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Interview Questions", __LINE__, __FILE__, "RemoveDuplicateSideBySide()");
#endif // _DEBUG
			assert(i_string);

			int start = 1;
			int skip = 0;

			while (i_string[start-1] != '\0')
			{
				if (i_string[start -1] != i_string[start])
				{
					start++;
					RemoveDuplicateSideBySide(i_string);
				}
			}
			return i_string;
		}

		char* Reverse(char* i_string)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Interview Questions", __LINE__, __FILE__, "Reverse()");
#endif // _DEBUG
			assert(i_string);

			size_t count = 0;
			while (i_string[0] != '\0')
			{
				i_string++;
				count++;
			}

			i_string--;
			char* o_string = new char[count];

			for (int i = 0; i < count; i++)
			{
				o_string[i] = i_string[0];
				i_string--;
			}
			return o_string;
		}
		
		size_t GetDepth(bTree *i_bTree)
		{
#ifdef _DEBUG
			Engine::DebugLogging::ConsolePrint("Interview Questions", __LINE__, __FILE__, "GetDepth()");
#endif // _DEBUG
			assert(i_bTree);

			size_t o_depth = 0;
			size_t leftSize = 0;
			size_t rightSize = 0;
			bTree *pLeftTree = i_bTree->pLeft;
			bTree *pRightTree = i_bTree->pRight;

			if (pLeftTree || pRightTree)
			{
				leftSize += GetDepth(pLeftTree);
				rightSize += GetDepth(pRightTree);
			}
			
			if (leftSize > rightSize)
				o_depth = leftSize++;
			else
				o_depth = rightSize++;

			return o_depth;
		}
	}
}