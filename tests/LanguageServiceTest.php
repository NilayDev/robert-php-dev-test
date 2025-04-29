<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/Services/LanguagesService.php';
require_once __DIR__ . '/../src/Models/Languages.php';

class LanguagesServiceTest extends TestCase
{
    private $mockLanguages;
    private $languagesService;

    protected function setUp(): void
    {
        $this->mockLanguages = $this->createMock(Languages::class);

        $this->languagesService = new class($this->mockLanguages) extends LanguagesService {
            public function __construct($mockLanguages)
            {
                $this->languages = $mockLanguages;
            }
        };
    }

    public function testGetAllReturnsLanguages()
    {
        $expected = [
            ['id' => 1, 'code' => 'en', 'name' => 'English'],
            ['id' => 2, 'code' => 'fr', 'name' => 'French'],
        ];

        $this->mockLanguages->method('getAll')->willReturn($expected);

        $result = $this->languagesService->getAll();

        $this->assertEquals($expected, $result);
    }

    public function testGetByIdReturnsCorrectLanguage()
    {
        $expected = ['id' => 1, 'code' => 'en', 'name' => 'English'];

        $this->mockLanguages->method('getById')->with(1)->willReturn($expected);

        $result = $this->languagesService->getById(1);

        $this->assertEquals($expected, $result);
    }

    public function testGetByCodeReturnsCorrectLanguage()
    {
        $expected = ['id' => 2, 'code' => 'fr', 'name' => 'French'];

        $this->mockLanguages->method('getByCode')->with('fr')->willReturn($expected);

        $result = $this->languagesService->getByCode('fr');

        $this->assertEquals($expected, $result);
    }
}