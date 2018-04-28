// Copyright 1998-2018 Epic Games, Inc. All Rights Reserved.

#include "VirtualWorlds_FinalGameMode.h"
#include "VirtualWorlds_FinalCharacter.h"
#include "UObject/ConstructorHelpers.h"

AVirtualWorlds_FinalGameMode::AVirtualWorlds_FinalGameMode()
{
	// set default pawn class to our Blueprinted character
	static ConstructorHelpers::FClassFinder<APawn> PlayerPawnBPClass(TEXT("/Game/ThirdPersonCPP/Blueprints/ThirdPersonCharacter"));
	if (PlayerPawnBPClass.Class != NULL)
	{
		DefaultPawnClass = PlayerPawnBPClass.Class;
	}
}
