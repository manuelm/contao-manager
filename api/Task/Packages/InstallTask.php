<?php

namespace Contao\ManagerApi\Task\Packages;

use Contao\ManagerApi\Composer\CloudChanges;
use Contao\ManagerApi\Composer\CloudResolver;
use Contao\ManagerApi\Composer\Environment;
use Contao\ManagerApi\Config\ManagerConfig;
use Contao\ManagerApi\I18n\Translator;
use Contao\ManagerApi\Process\ConsoleProcessFactory;
use Contao\ManagerApi\Task\TaskConfig;
use Contao\ManagerApi\Task\TaskStatus;
use Contao\ManagerApi\TaskOperation\Composer\CloudOperation;
use Contao\ManagerApi\TaskOperation\Composer\InstallOperation;
use Symfony\Component\Filesystem\Filesystem;

class InstallTask extends AbstractPackagesTask
{
    /**
     * @var CloudResolver
     */
    private $cloudResolver;

    /**
     * @var ConsoleProcessFactory
     */
    private $processFactory;

    /**
     * @var Environment
     */
    private $environment;

    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * Constructor.
     *
     * @param ConsoleProcessFactory $processFactory
     * @param CloudResolver         $cloudResolver
     * @param Environment           $environment
     * @param ManagerConfig         $managerConfig
     * @param Translator            $translator
     * @param Filesystem            $filesystem
     */
    public function __construct(ConsoleProcessFactory $processFactory, CloudResolver $cloudResolver, Environment $environment, ManagerConfig $managerConfig, Translator $translator, Filesystem $filesystem)
    {
        parent::__construct($environment, $managerConfig, $filesystem, $translator);

        $this->processFactory = $processFactory;
        $this->cloudResolver = $cloudResolver;
        $this->environment = $environment;
        $this->filesystem = $filesystem;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'install_packages';
    }

    /**
     * @inheritDoc
     */
    protected function buildOperations(TaskConfig $config)
    {
        $changes = new CloudChanges($this->environment->getJsonFile());
        $changes->setDryRun((bool) $config->getOption('dry_run', false));

        $operations = [];

        if ($this->useCloud() && !$this->filesystem->exists($this->environment->getLockFile())) {
            $operations[] = new CloudOperation(
                $this->cloudResolver,
                $changes,
                $config,
                $this->environment,
                $this->filesystem
            );
        }

        $operations[] = new InstallOperation($this->processFactory, $changes->getDryRun());

        return $operations;
    }
}
