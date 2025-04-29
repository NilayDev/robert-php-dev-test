<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Services/TranslationsService.php';
require_once __DIR__ . '/../src/Models/Translations.php';
require_once __DIR__ . '/../src/Services/LanguagesService.php';
require_once __DIR__ . '/../src/Services/TranslationUnitsService.php';
require_once __DIR__ . '/../src/Services/TranslationUnitLinksService.php';

class TranslationServiceTest extends TestCase
{
    private $pdoMock;
    private $dbMock;
    private $translationMock;
    private $languageServiceMock;
    private $translationUnitsServiceMock;
    private $translationUnitLinksServiceMock;
    private $service;

    /**
     * @runInSeparateProcess
     * @preserveGlobalState disabled
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->translationMock = $this->createMock(Translations::class);
        $this->pdoMock = $this->createMock(PDO::class);
        $this->languageServiceMock = $this->createMock(LanguagesService::class);
        $this->translationUnitsServiceMock = $this->createMock(TranslationUnitsService::class);
        $this->translationUnitLinksServiceMock = $this->createMock(TranslationUnitLinksService::class);

        $this->service = new TranslationsService(
            $this->pdoMock,
            $this->translationMock,
            $this->languageServiceMock,
            $this->translationUnitsServiceMock,
            $this->translationUnitLinksServiceMock
        );
    }


    public function testGetAllReturnsTranslations()
    {
        $this->translationMock->expects($this->once())
            ->method('getAll')
            ->with(0, 10)
            ->willReturn(['data' => [], 'total_records' => 0]);

        $result = $this->service->getAll(0, 10);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('total_records', $result);
    }

    public function testStoreInsertsTranslationAndUnits()
    {
        $request = [
            'title' => 'Test',
            'content' => 'Hello world. Welcome!',
            'source_language_id' => 1,
            'target_language_id' => 2,
        ];

        $this->translationMock->expects($this->once())
            ->method('store')
            ->with('Test', 1, 2)
            ->willReturn(101);

        $this->translationUnitsServiceMock->expects($this->any())
            ->method('findExistingUnit')
            ->willReturn(null);

        $this->languageServiceMock->expects($this->any())
            ->method('getById')
            ->will($this->returnCallback(function ($id) {
                return ['CODE' => $id === 1 ? 'en' : 'fr'];
            }));

        $this->translationUnitsServiceMock->expects($this->any())
            ->method('store')
            ->willReturn(201);

        $this->translationUnitLinksServiceMock->expects($this->any())
            ->method('store');

        $result = $this->service->store($request);
        $this->assertTrue($result);
    }

    public function testUpdateModifiesTranslation()
    {
        $data = [
            'title' => 'Test',
            'content' => 'Updated content',
            'source_language_id' => 1,
            'target_language_id' => 2,
            'translation_unit_id' => 1
        ];

        $this->translationMock->expects($this->once())
            ->method('update')
            ->with(1, 'Test', 1, 2);

        $this->translationUnitLinksServiceMock->expects($this->any())
            ->method('getByTranslationIds')
            ->willReturn(null);

        $this->translationUnitsServiceMock->expects($this->any())
            ->method('findExistingUnit')
            ->willReturn(null);

        $this->languageServiceMock->expects($this->any())
            ->method('getById')
            ->will($this->returnCallback(function ($id) {
                return ['CODE' => $id === 1 ? 'en' : 'fr'];
            }));

        $this->translationUnitsServiceMock->expects($this->any())
            ->method('store')
            ->willReturn(201);

        $this->translationUnitLinksServiceMock->expects($this->any())
            ->method('store')
            ->willReturn(301);

        unset($data['translation_unit_id']);
        $result = $this->service->update(1, $data);
        $this->assertTrue($result);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
}
