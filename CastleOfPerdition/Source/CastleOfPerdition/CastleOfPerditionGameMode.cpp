// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.

#include "CastleOfPerditionGameMode.h"
#include "CastleOfPerditionCharacter.h"

ACastleOfPerditionGameMode::ACastleOfPerditionGameMode()
{
	// Set default pawn class to our character
	DefaultPawnClass = ACastleOfPerditionCharacter::StaticClass();	
}
