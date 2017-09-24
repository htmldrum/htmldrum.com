# Flow:
  - Need for Docker
    - Virtualization
  - Workflow with Docker
  - Infrastructure tools in the Docker ecosystem
    - Docker is the standard
    - Docker Toolbox
      - Docker Image
        - Utilizes AuFS - a union filesystem to take a base operating system and categorise changes to
        it using diffs
        - auFS allows read only filesystems so multiple containers can mount at different points and share underlying resources
      - Docker Engine
        - Uses an operating system library libcontainer, formerly LXC (linux containers), to share operating system resources
          - Libcontainer takes over ring 0, root mode of CPU, and intercepts all priviledged calls by guest OS to create the illusion that the running application has aitws own hardware
            - Namespaces: Partition resources by namespace
              - pid, net, ipc, mnt, uts, custom
              - pid: process group hierarchy
                - parents, children, observability, IPC, signals, tracing
              - net: different network interfaces for different namespaces
                - routing networks to eachother
                - has its own routing table, iptables and rules
              - ipc: separate semaphores, message queues and shared memory segments
                - won't have collisions for ipc resources
              - mnt: sandboxing filesystem views
                - each container has its own mountpoints
              - uts: hostname isolation. each container will have its own hostname
                - updating hostname will only update the hostname for that container
              - http://web.archive.org/web/20150326185901/http://blog.dotcloud.com/under-the-hood-linux-kernels-on-dotcloud-part

          - But localized to a given base image, daemon cannot facilitate much sharing with divergent images
        - Fully virtualized systems get their own resources, with minimal sharing
          - More isolation but less scalable
        - Snapshots of OS into shared images, making it easy to run applications in their production state locally
      - Docker Repositories
      - Future
        - cgroups integration
          - Linux kernel integration
            Control cgroups, usually referred to as cgroups, are a Linux kernel
       feature which which allow processes to be organized into hierarchical
       groups whose usage of various types of resources can then be limited
       and monitored.  The kernel's cgroup interface is provided through a
       pseudo-filesystem called cgroupfs
          - cgroup is a collection of processed bound to a set of limits defined via cgroup filesystem
          - Resource controllers
            - CPU time partition and accounting
            - Freezing / resuming execution
          - cgroups v2 unified hierarchy
            - single hierarchy rather than multiple mount points allowing unified, atomic behavior
            - http://man7.org/linux/man-pages/man7/cgroups.7.html
          - systemd organizes processes with cgroups
