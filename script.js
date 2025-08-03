document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('configForm');
    const yamlOutput = document.getElementById('yamlOutput');
    const librariesContainer = document.getElementById('libraries-container');
    const addLibraryButton = document.getElementById('add-library-button');
    let libraryIndex = 2;

    addLibraryButton.addEventListener('click', () => {
        addLibraryForm(libraryIndex);
        libraryIndex++;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const yamlString = generateFullYamlString();
            yamlOutput.value = yamlString;
        } catch (error) {
            console.error("Failed to generate YAML:", error);
            yamlOutput.value = `# An error occurred while generating the YAML.
# Please check the console (F12) for details and ensure all required fields are filled correctly.
# Error: ${error.message}`;
        }
    });

    function getSafeValue(id, property = 'value', defaultValue = '') {
        const element = document.getElementById(id);
        if (element) {
            if (property === 'checked') {
                return element.checked;
            }
            return element[property] || defaultValue;
        }
        return defaultValue;
    }

    function addLibraryForm(index) {
        const newLibraryDiv = document.createElement('div');
        newLibraryDiv.classList.add('library-entry');
        newLibraryDiv.setAttribute('data-library-name', `New Library ${index}`);
        newLibraryDiv.innerHTML = `
            <label for="libraryName_${index}">Library Name:</label>
            <input type="text" id="libraryName_${index}" value="New Library ${index}">
            <label for="libraryAlternateName_${index}">Alternate Name:</label>
            <input type="text" id="libraryAlternateName_${index}" value="">
            <label for="libraryID_${index}">ID:</label>
            <input type="number" id="libraryID_${index}" value="0">
            <h5>Metrics for New Library ${index}</h5>
            <label for="libraryAlbumsEnable_${index}">Albums:</label>
            <input type="checkbox" id="libraryAlbumsEnable_${index}">
            <label for="libraryArtistsEnable_${index}">Artists:</label>
            <input type="checkbox" id="libraryArtistsEnable_${index}">
            <label for="libraryEpisodesEnable_${index}">Episodes:</label>
            <input type="checkbox" id="libraryEpisodesEnable_${index}">
            <label for="libraryMoviesEnable_${index}">Movies:</label>
            <input type="checkbox" id="libraryMoviesEnable_${index}">
            <label for="librarySeriesEnable_${index}">Series:</label>
            <input type="checkbox" id="librarySeriesEnable_${index}">
            <label for="libraryTracksEnable_${index}">Tracks:</label>
            <input type="checkbox" id="libraryTracksEnable_${index}">
            <label for="libraryRecentlyaddedEnable_${index}">Recently Added:</label>
            <input type="checkbox" id="libraryRecentlyaddedEnable_${index}">
            <label for="libraryRecentlyaddedHours_${index}">Recently Added Hours:</label>
            <input type="number" id="libraryRecentlyaddedHours_${index}" value="24">
        `;
        librariesContainer.appendChild(newLibraryDiv);
    }
    
    function generateFullYamlString() {
        const libraryYamlBlocks = Array.from(document.querySelectorAll('.library-entry')).map((entry, index) => {
            const libraryName = getSafeValue(`libraryName_${index}`);
            const alternateName = getSafeValue(`libraryAlternateName_${index}`);
            const id = getSafeValue(`libraryID_${index}`);
            const metricsBlock = generateLibraryMetrics(index);
            
            return `      # The name of the library in Plex
      - Name: "${libraryName}"
        # A friendlier name for the library to use in Discord
        AlternateName: "${alternateName}"
        # The ID of the library in Tautulli, to differentiate between libraries with the same name. Set to 0 to ignore
        ID: ${id}
        # How to display stats for each type of media in this library
        # Only relevant stats will be included based on library type (e.g. a TV Show library will ignore Album settings)
${metricsBlock}`;
        });

        return `# yaml-language-server: $schema=https://raw.githubusercontent.com/nwithan8/tauticord/master/.schema/config_v2.schema.json

# Tautulli settings
Tautulli:
  # The URL of the Tautulli server
  URL: "${getSafeValue('tautulliURL')}"
  # The API key for the Tautulli server
  APIKey: "${getSafeValue('tautulliAPIKey')}"
  # Whether to use a self-signed certificate
  UseSelfSignedCert: ${getSafeValue('tautulliUseSelfSignedCert', 'checked')}
  # How often (in seconds) the bot pulls new data. 5-second minimum built-in, it's for your own good
  RefreshSeconds: ${getSafeValue('tautulliRefreshSeconds')}
  # The message to display when a stream is terminated
  TerminateMessage: "${getSafeValue('tautulliTerminateMessage')}"

# Discord settings
Discord:
  # The token for the Discord bot
  BotToken: "${getSafeValue('discordBotToken')}"
  # The ID of the server
  ServerID: '${getSafeValue('discordServerID')}' # Right-click on your server's icon -> "Copy ID"
  # List of admin IDs
  AdminIDs:
    - '${getSafeValue('discordAdminIDs', 'value', '').split(',')[0].trim()}' # Right-click on your profile picture -> "Copy ID"
  # Whether to post a live stats summary message
  PostSummaryMessage: ${getSafeValue('discordPostSummaryMessage', 'checked')}
  # The name of the channel where the live stats summary message will be posted
  ChannelName: "${getSafeValue('discordChannelName')}"
  # Whether to enable termination capabilities (requires Plex Pass)
  EnableTermination: ${getSafeValue('discordEnableTermination', 'checked')}
  # Whether to enable slash commands
  EnableSlashCommands: ${getSafeValue('discordEnableSlashCommands', 'checked')}
  # Settings for the activity/status message
  StatusMessage:
    # Whether to enable the status message
    Enable: ${getSafeValue('statusMessageEnable', 'checked')}
    # A custom message to display in the status message, overriding the default message
    CustomMessage: '${getSafeValue('statusMessageCustomMessage')}'
    # Whether to display the number of streams in the default message
    ShowStreamCount: ${getSafeValue('statusMessageShowStreamCount', 'checked')}

# Display settings
Display:
  # Anonymization settings
  Anonymize:
    # Whether to hide bandwidth
    HideBandwidth: ${getSafeValue('anonymizeHideBandwidth', 'checked')}
    # Whether to hide ETA
    HideETA: ${getSafeValue('anonymizeHideETA', 'checked')}
    # Whether to hide platforms
    HidePlatforms: ${getSafeValue('anonymizeHidePlatforms', 'checked')}
    # Whether to hide player names
    HidePlayerNames: ${getSafeValue('anonymizeHidePlayerNames', 'checked')}
    # Whether to hide progress
    HideProgress: ${getSafeValue('anonymizeHideProgress', 'checked')}
    # Whether to hide quality
    HideQuality: ${getSafeValue('anonymizeHideQuality', 'checked')}
    # Whether to hide transcode
    HideTranscode: ${getSafeValue('anonymizeHideTranscode', 'checked')}
    # Whether to hide usernames
    HideUsernames: ${getSafeValue('anonymizeHideUsernames', 'checked')}
  # The name of the server
  ServerName: '${getSafeValue('displayServerName')}'
  # The thousands separator
  ThousandsSeparator: '${getSafeValue('displayThousandsSeparator')}'
  # Time settings
  Time: {}
  # Whether to use Plex users' names instead of usernames
  UseFriendlyNames: ${getSafeValue('displayUseFriendlyNames', 'checked')}

# Extra settings
Extras:
  # Whether to allow analytics. See README.md for details
  AllowAnalytics: ${getSafeValue('extrasAllowAnalytics', 'checked')}
  # Whether to enable reminders to update Tauticord
  EnableUpdateReminders: ${getSafeValue('extrasEnableUpdateReminders', 'checked')}

# Stats settings
Stats:
  # Activity stats about the Plex server
  Activity:
    # The name of the category
    CategoryName: "${getSafeValue('activityCategoryName')}"
    # Whether to enable the stats
    Enable: ${getSafeValue('activityEnable', 'checked')}
    # The types of stats
    StatTypes:
      # Bandwidth settings
      Bandwidth:
        # The custom name
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable bandwidth stats
        Enable: ${getSafeValue('statBandwidthEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Localbandwidth settings
      LocalBandwidth:
        # The custom name
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable local bandwidth stats
        Enable: ${getSafeValue('statLocalBandwidthEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Remotebandwidth settings
      RemoteBandwidth:
        # The custom name
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable remote bandwidth stats
        Enable: ${getSafeValue('statRemoteBandwidthEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Plexserveravailability settings
      PlexServerAvailability:
        # The custom name
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable plex server availability stats
        Enable: ${getSafeValue('statPlexServerAvailabilityEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Streamcount settings
      StreamCount:
        # The custom name
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable stream count stats
        Enable: ${getSafeValue('statStreamCountEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Transcodecount settings
      TranscodeCount:
        # The custom name
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable transcode count stats
        Enable: ${getSafeValue('statTranscodecountEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
  # Stats about the Plex server's libraries
  Libraries:
    # Whether to enable library stats
    Enable: ${getSafeValue('librariesEnable', 'checked')}
    # The name of the category
    CategoryName: "${getSafeValue('librariesCategoryName')}"
    # How often (in seconds) to refresh the stats
    RefreshSeconds: ${getSafeValue('librariesRefreshSeconds')}
    # The libraries
    Libraries:
${libraryYamlBlocks.join('\n')}
    # Libraries to combine into an aggregate library
    CombinedLibraries: []
  # Stats about the Tauticord host's performance
  Performance:
    # The name of the category
    CategoryName: "${getSafeValue('performanceCategoryName')}"
    # Whether to enable performance stats
    Enable: ${getSafeValue('performanceEnable', 'checked')}
    # The metrics
    Metrics:
      # Cpu settings
      CPU:
        # The custom name for this metric
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable cpu stats
        Enable: ${getSafeValue('metricCpuEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Diskspace settings
      DiskSpace:
        # The custom name for this metric
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable disk space stats
        Enable: ${getSafeValue('metricDiskspaceEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Memory settings
      Memory:
        # The custom name for this metric
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable memory stats
        Enable: ${getSafeValue('metricMemoryEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0
      # Usercount settings
      UserCount:
        # The custom name for this metric
        CustomName: ''
        # The custom emoji
        CustomEmoji: ''
        # Whether to enable user count stats
        Enable: ${getSafeValue('metricUsercountEnable', 'checked')}
        # The ID of the voice channel
        VoiceChannelID: 0`;
    }

    function generateLibraryMetrics(index) {
        const metricLines = [];
        const allMetrics = ['Albums', 'Artists', 'Episodes', 'Movies', 'Series', 'Tracks', 'Recentlyadded'];
        
        allMetrics.forEach(metric => {
            const isEnabled = getSafeValue(`library${metric}Enable_${index}`, 'checked');
            metricLines.push(`        ${metric}:`);
            metricLines.push(`          # The custom name for this metric`);
            metricLines.push(`          CustomName: ''`);
            metricLines.push(`          # The custom emoji for this metric`);
            metricLines.push(`          CustomEmoji: ''`);
            metricLines.push(`          # Whether to display this metric for this library`);
            metricLines.push(`          Enable: ${isEnabled}`);
            metricLines.push(`          # The ID of the voice channel`);
            metricLines.push(`          VoiceChannelID: 0`);
            if (metric === 'Recentlyadded') {
                const hours = getSafeValue(`libraryRecentlyaddedHours_${index}`, 'value', '24');
                metricLines.push(`          # The number of hours to consider items "recently added"`);
                metricLines.push(`          Hours: ${hours}`);
            }
        });

        return metricLines.join('\n');
    }

    function copyToClipboard() {
        const yamlOutput = document.getElementById('yamlOutput');
        yamlOutput.select();
        yamlOutput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        alert('YAML copied to clipboard!');
    }
});
