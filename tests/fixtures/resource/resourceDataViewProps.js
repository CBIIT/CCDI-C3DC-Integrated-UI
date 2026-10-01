/**
 * Minimal shapes for resource *ResourceView props.
 * YAML-shaped props for resource *ResourceView / *ResourceController tests.
 */

/** ToolsResourceController requires `toolsContent` to render the view. */
export const minimalToolsResourceData = {
  title: 'CCDI Hub Tools',
  Tools_Header: 'https://example.com/tools-header.png',
  toolsIntroText: 'Tools intro for unit test.',
  navTitles: ['Tools Topic One', 'Tool Subsection A'],
  toolsContent: [
    {
      id: 'tools_section_one',
      topic: 'Tools Topic One',
      list: [
        {
          id: 'tools_sub_a',
          subtopic: 'Tool Subsection A',
          content: 'Tool section body for testing.',
        },
      ],
    },
  ],
};

export const minimalFederationResourceData = {
  title: 'CCDI Data Federation Resource',
  Federation_Header: 'https://example.com/federation-header.png',
  federationIntroText: 'Federation intro for unit test.',
  navTitles: ['Federation Overview'],
  federationContent: [
    {
      id: 'fed_overview',
      topic: 'Federation Overview',
      content: 'Federation body content.',
      segments: [{ type: 'markdown', markdown: 'Federation body content.' }],
      list: [],
    },
  ],
};

/** CCDIEventAnnouncementsResourceController requires `ccdiEventAnnouncementsContent`. */
export const minimalCcdiEventAnnouncementsResourceData = {
  CCDI_Event_Announcements_Header: '',
  ccdiEventAnnouncementsIntroText: 'CCDI events intro for unit test.',
  ccdiEventAnnouncementsContent: [
    {
      id: 'event_section',
      topic: 'Announcements Topic',
      content: 'Announcements body.',
    },
  ],
};

export const minimalRareCancerResourceData = {
  title: 'Pediatric, Adolescent, and Young Adult Rare Cancer Study',
  rareCancerIntroText: 'Rare cancer intro for unit test.',
  navTitles: ['Rare Cancer Topic', 'Rare Subsection'],
  rareCancerContent: [
    {
      id: 'rc_section',
      topic: 'Rare Cancer Topic',
      list: [
        {
          id: 'rc_sub',
          subtopic: 'Rare Subsection',
          content: 'Rare cancer subsection body.',
        },
      ],
    },
  ],
};

/** Intro block renders when `cpiIntroText` is truthy (see cBioPortalResourceView). */
export const minimalCBioPortalResourceData = {
  cpiIntroText: '<span>intro gate</span>',
  cbioportalIntroText: '<p>cBioPortal intro for unit test.</p>',
  cbioportalContent: [
    {
      id: 'cbio_section',
      topic: 'cBioPortal Topic',
      content: '<p>cBioPortal section body.</p>',
    },
  ],
};

/** ToolsResourceView also supports a flat (non-nested) toolsContent list. */
export const flatToolsResourceData = {
  Tools_Header: 'https://example.com/tools-header.png',
  toolsIntroText: 'Flat tools intro.',
  toolsContent: [
    {
      id: 'flat_topic',
      topic: 'Flat Topic',
      content: '<p>Flat topic body.</p>',
    },
    {
      id: 'flat_sub',
      subtopic: 'Flat Subtopic',
      content: '<p>Flat subtopic body.</p>',
    },
  ],
};
