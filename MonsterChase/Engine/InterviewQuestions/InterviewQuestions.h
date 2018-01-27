#pragma once

namespace Engine
{
	namespace Interview
	{
		struct bTree
		{
			size_t key;
			bTree* pLeft;
			bTree* pRight;
		};

		struct cList
		{
			size_t key;
			cList* pNext;
		};

		bool IfCircular(cList* i_list);
		bool IsPalindrome(const char* i_string);
		char* RemoveCharacter(const char* i_string, char i_character);
		char* RemoveDuplicateSideBySide(char* i_string);
		char* Reverse(char* i_string);
		size_t GetDepth(bTree* i_bTree);
	}
}