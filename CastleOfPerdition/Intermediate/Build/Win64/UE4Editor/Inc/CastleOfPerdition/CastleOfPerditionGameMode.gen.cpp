// Copyright 1998-2017 Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

#include "GeneratedCppIncludes.h"
#include "CastleOfPerditionGameMode.h"
#ifdef _MSC_VER
#pragma warning (push)
#pragma warning (disable : 4883)
#endif
PRAGMA_DISABLE_DEPRECATION_WARNINGS
void EmptyLinkFunctionForGeneratedCodeCastleOfPerditionGameMode() {}
// Cross Module References
	CASTLEOFPERDITION_API UClass* Z_Construct_UClass_ACastleOfPerditionGameMode_NoRegister();
	CASTLEOFPERDITION_API UClass* Z_Construct_UClass_ACastleOfPerditionGameMode();
	ENGINE_API UClass* Z_Construct_UClass_AGameModeBase();
	UPackage* Z_Construct_UPackage__Script_CastleOfPerdition();
// End Cross Module References
	void ACastleOfPerditionGameMode::StaticRegisterNativesACastleOfPerditionGameMode()
	{
	}
	UClass* Z_Construct_UClass_ACastleOfPerditionGameMode_NoRegister()
	{
		return ACastleOfPerditionGameMode::StaticClass();
	}
	UClass* Z_Construct_UClass_ACastleOfPerditionGameMode()
	{
		static UClass* OuterClass = nullptr;
		if (!OuterClass)
		{
			static UObject* (*const DependentSingletons[])() = {
				(UObject* (*)())Z_Construct_UClass_AGameModeBase,
				(UObject* (*)())Z_Construct_UPackage__Script_CastleOfPerdition,
			};
#if WITH_METADATA
			static const UE4CodeGen_Private::FMetaDataPairParam Class_MetaDataParams[] = {
				{ "HideCategories", "Info Rendering MovementReplication Replication Actor Input Movement Collision Rendering Utilities|Transformation" },
				{ "IncludePath", "CastleOfPerditionGameMode.h" },
				{ "ModuleRelativePath", "CastleOfPerditionGameMode.h" },
				{ "ShowCategories", "Input|MouseInput Input|TouchInput" },
				{ "ToolTip", "The GameMode defines the game being played. It governs the game rules, scoring, what actors\nare allowed to exist in this game type, and who may enter the game.\n\nThis game mode just sets the default pawn to be the MyCharacter asset, which is a subclass of CastleOfPerditionCharacter" },
			};
#endif
			static const FCppClassTypeInfoStatic StaticCppClassTypeInfo = {
				TCppClassTypeTraits<ACastleOfPerditionGameMode>::IsAbstract,
			};
			static const UE4CodeGen_Private::FClassParams ClassParams = {
				&ACastleOfPerditionGameMode::StaticClass,
				DependentSingletons, ARRAY_COUNT(DependentSingletons),
				0x00880288u,
				nullptr, 0,
				nullptr, 0,
				nullptr,
				&StaticCppClassTypeInfo,
				nullptr, 0,
				METADATA_PARAMS(Class_MetaDataParams, ARRAY_COUNT(Class_MetaDataParams))
			};
			UE4CodeGen_Private::ConstructUClass(OuterClass, ClassParams);
		}
		return OuterClass;
	}
	IMPLEMENT_CLASS(ACastleOfPerditionGameMode, 291191871);
	static FCompiledInDefer Z_CompiledInDefer_UClass_ACastleOfPerditionGameMode(Z_Construct_UClass_ACastleOfPerditionGameMode, &ACastleOfPerditionGameMode::StaticClass, TEXT("/Script/CastleOfPerdition"), TEXT("ACastleOfPerditionGameMode"), false, nullptr, nullptr, nullptr);
	DEFINE_VTABLE_PTR_HELPER_CTOR(ACastleOfPerditionGameMode);
PRAGMA_ENABLE_DEPRECATION_WARNINGS
#ifdef _MSC_VER
#pragma warning (pop)
#endif
