import React from 'react';
import { PortableText} from '@portabletext/react'
import { portableTextComponents } from '@/components/portableText';
import { SanityTeamSection } from '@/types/sanity';


const TeamSectionComponent: React.FC<{ data: SanityTeamSection }> = ({ data }) => {
  return (
    <section className="focus-areas approach-sec team-sec">
      <div className="container">
        <div className="focus-areas-wrapper team-sec-wrapper">
          <div className="focus-areas-title team-sec-title line">
            <h5>{data.title}</h5>
          </div>
          <div className="focus-areas-content team-sec-content">
            {data.teamMembers.map((member, index) => (
              <div key={index} className="focus-areas-text team-sec-text line">
                <h2>{member.name}</h2>
                <p className="member_designation">{member.designation}</p>
                <div className="member_introduction">
                  <p>{member.introduction}</p>
                </div>
              </div>
            ))}
          </div>
          {data.additionalInfo && data.additionalInfo.length > 0 && (
            <div className="team-sec-info">
              <PortableText
                value={data.additionalInfo}
                components={portableTextComponents}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamSectionComponent;