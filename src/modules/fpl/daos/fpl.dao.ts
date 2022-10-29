import { TypeFplBootstrapDto } from '../dtos/type-fpl-bootstrap.dto';
import { TypeFplPlayerDto } from '../dtos/type-fpl-player.dto';
import { TypeFplWeekDto } from '../dtos/type-fpl-week.dto';

export abstract class FplDao {
  static transformBootstrapToPlayer = (
    bootstrap: TypeFplBootstrapDto,
  ): TypeFplPlayerDto[] => {
    const teams = bootstrap.teams;
    const roles = bootstrap.element_types;
    return bootstrap.elements.map((el) => {
      const team = teams.find((t) => t.code === el.team);
      const role = roles.find((role) => role.id === el.element_type);
      return {
        refId: el.id,
        firstName: el.first_name,
        secondName: el.second_name,
        club: team?.name ?? '-',
        webname: el.web_name,
        role: role?.plural_name ?? 'Forwards',
        price: el.now_cost,
        score: el.total_points,
      };
    });
  };

  static transformBootstrapToWeek = (
    bootstrap: TypeFplBootstrapDto,
  ): TypeFplWeekDto[] => {
    return bootstrap.events.map((week) => {
      const deadlineTime = new Date(week.deadline_time);
      const endDate = new Date(deadlineTime.getDate() + 24 * 60 * 60000);
      return {
        refId: week.id,
        weekNum: week.id,
        endDate: endDate,
        deadlineDate: deadlineTime,
        isCurrent: week.is_current,
        isNext: week.is_next,
        isPrevious: week.is_previous,
      };
    });
  };
}
